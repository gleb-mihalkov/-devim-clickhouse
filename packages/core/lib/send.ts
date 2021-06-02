import { createHeaders } from './createHeaders';
import { getUserAgent } from './getUserAgent';
import { createBody } from './createBody';
import { stringifyTime } from './stringifyTime';
import { getTimeZone } from './getTimeZone';
import { getScreenHeight } from './getScreenHeight';
import { getScreenWidth } from './getScreenWidth';
import { getFingerprint } from './getFingerprint';
import { getIsIncognito } from './getIsIncognito';
import { getUtmSource } from './getUtmSource';
import { getSessionId } from './getSessionId';
import { getReferrer } from './getReferrer';
import { getConfig } from './config';
import { stringifyTimezone } from './stringifyTimezone';

/**
 * Дополнительные параметры события.
 */
type Params = {
  /**
   * Уникальный идентификатор авторизованного пользователя.
   */
  userId?: string;

  /**
   * Уникальный идентификатор устройства, с которого пользователь зашел на
   * сайт. Если не указано, функция определит его самостоятельно.
   */
  fingerprint?: string;

  /**
   * Указывает, что переданное событие является событием прекращения
   * авторизации пользователя.
   */
  logout?: boolean;

  /**
   * Дополнительное значение, передаваемое вместе с событием.
   */
  payload?: any;

  /**
   * Указывает, что информацию, отправляемую на сервер, нужно логгировать в
   * браузерную консоль.
   *
   * Информация записывается в режиме verbose и c префиксом `clickhouse_event`.
   */
  verbose?: boolean;

  /**
   * Время отправки события. Если не указано, будет использовано текущее
   * браузерное время.
   */
  time?: Date;

  /**
   * Часовой пояс пользователя (например, `3` для Москвы или `-4` для
   * Нью-Йорка). Если не указано, функция определит его самостоятельно.
   */
  timezone?: number;

  /**
   * Высота экрана пользователя в пикселях. Если не указано, функция определит
   * её самостоятельно.
   */
  screenHeight?: number;

  /**
   * Ширина экрана пользователя в пикселях. Если не указано, функция
   * определит её самостоятельно.
   */
  screenWidth?: number;

  /**
   * Содержимое заголовка `Referrer`, с которым пользователь пришёл на страницу.
   * Если не указано, функция определит его самостоятельно.
   */
  referrer?: string;

  /**
   * Содержимое заголовка `User-Agent`, с которым пользователь пришёл на
   * страницу. Если не указано, функция определит его самостоятельно.
   */
  userAgent?: string;

  /**
   * Источник перехода на сайт (задаётся в адресе страницы). Если не указано,
   * функция попробует получить актуальное значение из адреса страницы.
   */
  utmSource?: string;
};

/**
 * Отправляет указанное событие в сервис аналитики.
 * @param event Название события.
 * @param params Дополнительные параметры события.
 */
export const send = async (event: string, params: Params = {}) => {
  const config = getConfig();

  const headers = createHeaders({
    [`Content-Type`]: 'application/json',
    [`Accept`]: 'application/json',
    [`User-Agent`]: params.userAgent ?? getUserAgent(),
    [`X-UserID`]: params.userId,
    [`X-API-KEY`]: config.id || undefined,
    [`X-SessionID`]: getSessionId(params.logout),
  });

  const body = createBody({
    event,
    eventValue: params.payload,
    fingerprintID: params.fingerprint ?? getFingerprint(),
    referer: params.referrer ?? getReferrer(),
    source: params.utmSource ?? getUtmSource(),
    screenHeight: params.screenHeight ?? getScreenHeight(),
    screenWidth: params.screenWidth ?? getScreenWidth(),
    isIncognito: await getIsIncognito(),
    localTime: stringifyTime(params.time ?? new Date()),
    timeZone:
      params.timezone == null
        ? getTimeZone()
        : stringifyTimezone(params.timezone),
  });

  if (params.verbose && typeof console !== 'undefined') {
    console.debug('clickhouse_event', event, body);
  }

  if (config.url) {
    try {
      await fetch(config.url, {
        headers,
        method: 'post',
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error(error);
    }
  } else {
    await Promise.resolve();
  }
};
