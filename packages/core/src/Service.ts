import Config from './Config';
import DataHelper from './DataHelper';
import Event from './Event';
import Params from './Params';
import RequestHelper from './RequestHelper';

/**
 * Сервис, предоставляющий методы для отправки событий в Clickhouse API.
 */
export default class Service {
  /**
   * Конфигурация сервиса, переданная в конструктор.
   */
  private readonly config: Config;

  /**
   * Создаёт экземпляр сервиса с указанной конфигурацией.
   * @param config Объект конфигурации сервиса.
   */
  public constructor(config: Config = {}) {
    this.config = config;
  }

  /**
   * Заполняет недостающие параметры указанного события значениями по
   * умолчанию.
   * @param event Событие.
   */
  private async assignDefaults(event: Event) {
    event.sessionId = DataHelper.getSessionId(event.logout);

    function isNotExists(key: keyof Event) {
      return !Object.prototype.hasOwnProperty.call(event, key);
    }

    if (isNotExists('deviceId')) {
      event.deviceId = DataHelper.getDeviceId();
    }

    if (isNotExists('userAgent')) {
      event.userAgent = DataHelper.getUserAgent();
    }

    if (isNotExists('referrer')) {
      event.referrer = DataHelper.getReferrer();
    }

    if (isNotExists('screenHeight')) {
      event.screenHeight = DataHelper.getScreenHeight();
    }

    if (isNotExists('screenWidth')) {
      event.screenWidth = DataHelper.getScreenWidth();
    }

    if (isNotExists('isIncognito')) {
      event.isIncognito = await DataHelper.getIsIncognito();
    }

    if (isNotExists('time')) {
      event.time = DataHelper.getTime();
    }

    if (isNotExists('timezone')) {
      event.timezone = DataHelper.getTimeZone();
    }

    if (isNotExists('href')) {
      event.href = DataHelper.getHref();
    }

    const isUtmNotExists =
      isNotExists('utmCampaign') &&
      isNotExists('utmContent') &&
      isNotExists('utmSource') &&
      isNotExists('utmMedium') &&
      isNotExists('utmTerm');

    if (isUtmNotExists) {
      const search = DataHelper.getSearch();

      event.utmCampaign = search['utm_campaign'];
      event.utmContent = search['utm_content'];
      event.utmSource = search['utm_source'];
      event.utmMedium = search['utm_medium'];
      event.utmTerm = search['utm_term'];
    }
  }

  /**
   * Вызывает пользовательский хук `beforeAssignDefaults` из конфигурации
   * сервиса для указанного события.
   * @param event Событие.
   */
  private async beforeAssignDefaults(event: Event) {
    if (this.config.beforeAssignDefaults) {
      const result = this.config.beforeAssignDefaults(event);
      await Promise.resolve(result);
    }
  }

  /**
   * Вызывает пользовательский хук `beforeSend` из конфигурации сервиса для
   * указанного события.
   * @param event Событие.
   */
  private async beforeSend(event: Event) {
    if (this.config.beforeSend) {
      const result = this.config.beforeSend(event);
      await Promise.resolve(result);
    }
  }

  /**
   * Возвращает коллекцию заголовков запроса к API, полученную из указанного
   * события.
   * @param event Событие.
   */
  private async getHeaders(event: Event) {
    return RequestHelper.createHeaders({
      [`Content-Type`]: 'application/json',
      [`Accept`]: 'application/json',
      [`User-Agent`]: event.userAgent,
      [`X-UserID`]: event.userId,
      [`X-API-KEY`]: this.config.id || undefined,
      [`X-API-CLIENT-ID`]: this.config.clientId || undefined,
      [`X-SessionID`]: event.sessionId,
    });
  }

  /**
   * Возвращает тело запроса к API, полученное на основе указанного события.
   * @param event Событие.
   */
  private async getBody(event: Event) {
    return RequestHelper.createBody({
      event: event.name,
      eventValue: event.payload,
      fingerprintID: event.deviceId,
      referer: event.referrer,
      source: event.utmSource,
      campaign: event.utmCampaign,
      medium: event.utmMedium,
      content: event.utmContent,
      term: event.utmTerm,
      screenHeight: event.screenHeight,
      screenWidth: event.screenWidth,
      isIncognito: event.isIncognito,
      localTime: RequestHelper.formatTime(event.time as Date),
      testGroup: event.testGroup,
      timeZone: RequestHelper.formatTimezone(event.timezone as number),
      page: event.href,
    });
  }

  /**
   * Если сервис подключён к API, отправляет указанное событие на сервер. В
   * противном случае не делает ничего.
   * @param event Событие.
   */
  private async fetch(event: Event) {
    if (!this.config.url || !this.config.id || !this.config.clientId) {
      return;
    }

    const headers = await this.getHeaders(event);
    const body = await this.getBody(event);

    await fetch(this.config.url, {
      headers,
      body,
      method: 'post',
      mode: 'cors',
    });
  }

  /**
   * Если в конфигурации сервиса указан флаг `verbose`, логгирует указанное
   * событие. В противном случае не делает ничего.
   * @param event Событие.
   */
  private log(event: Event) {
    if (!this.config.verbose || typeof console === 'undefined') {
      return;
    }

    console.debug('clickhouse_event', event);
  }

  /**
   * Отправляет указанное событие в Clickhouse API.
   * @param name Название события.
   * @param params Параметры события.
   */
  public async send(name: string, params: Params = {}) {
    const event: Event = { name, ...params };

    await this.beforeAssignDefaults(event);
    await this.assignDefaults(event);
    await this.beforeSend(event);

    this.log(event);

    await this.fetch(event);
  }

  /**
   * Отправляет событие `visit` в Clickhouse API. Событие сингнализирует о
   * начале визита пользователя на сайт. Реальная отправка данного события
   * происходит только после начала браузерной сессии. Все последующие вызовы
   * метода ни к чему не приведут.
   *
   * Рекомендуется отправлять данное событие при `DOMContentLoaded` или первой
   * отрисовке приложения (если мы говорим о SPA).
   * @param params Параметры события.
   */
  public async sendVisit(params: Params = {}) {
    const visitId = DataHelper.getVisitId();

    if (visitId) {
      return;
    }

    DataHelper.setVisitId();

    await this.send('visit', params);
  }
}
