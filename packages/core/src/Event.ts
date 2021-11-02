/**
 * Представляет событие, отправляемое на сервер ClickHouse.
 */
interface Event {
  /**
   * Название события.
   */
  name: string;

  /**
   * Дополнительное значение, передаваемое вместе с событием.
   */
  payload?: any;

  /**
   * Уникальный идентификатор авторизованного пользователя.
   */
  userId?: string;

  /**
   * Уникальный идентификатор сессии пользователя. Лучше всего не трогать данное
   * свойство - библиотека заполняет его самостоятельно.
   */
  sessionId?: string;

  /**
   * Указывает, что переданное событие является событием прекращения
   * авторизации пользователя.
   *
   * Когда вы разрываете сессию текущего пользователя, следует передавать
   * данный флаг для того, чтобы метрика среагировала на это.
   */
  logout?: boolean;

  /**
   * Уникальный идентификатор устройства, с которого пользователь зашел на
   * сайт.
   */
  deviceId?: string;

  /**
   * Полный (включая домен) адрес страницы, с которой отправляется событие.
   */
  href?: string;

  /**
   * Содержимое заголовка `Referrer`, с которым пользователь пришёл на страницу.
   */
  referrer?: string;

  /**
   * Содержимое заголовка `User-Agent`, с которым пользователь пришёл на
   * страницу.
   */
  userAgent?: string;

  /**
   * Время отправки события. Если не указано, будет использовано текущее
   * браузерное время.
   */
  time?: Date;

  /**
   * Часовой пояс пользователя (например, `3` для Москвы или `-4` для
   * Нью-Йорка).
   */
  timezone?: number;

  /**
   * Высота экрана пользователя в пикселях.
   */
  screenHeight?: number;

  /**
   * Ширина экрана пользователя в пикселях.
   */
  screenWidth?: number;

  /**
   * Указывает, что браузер находится в режиме инкогнито.
   */
  isIncognito?: boolean;

  /**
   * Источник перехода на сайт (задаётся в адресе страницы).
   */
  utmSource?: string;

  /**
   * Рекламная кампания, в рамках которой пользователь перешёл на сайт
   * (задаётся в адресе страницы).
   */
  utmCampaign?: string;

  /**
   * Тип рекламного траффика, по которому пришел пользователь (задаётся
   * в адресе страницы).
   */
  utmMedium?: string;

  /**
   * Ключевая фраза поискового запроса, по которому пользователь нашел сайт
   * (задаётся в адресе страницы).
   */
  utmTerm?: string;

  /**
   * Дополнительная информация рекламного источника (задаётся в адресе
   * страницы).
   */
  utmContent?: string;

  /**
   * Поле, которое говорит нам о том, что залогинен оператор через 0000 или
   * пользователь.
   */
  operator?: boolean;
  
   * Поле, которое отвечает за группу аб теста.
   */
  testGroup?: Object;
}

export default Event;
