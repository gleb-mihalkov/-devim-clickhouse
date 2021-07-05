/**
 * Ключ, по которому в Cookie's хранится значение.
 */
enum CookieKey {
  /**
   * Идентификатор сессии.
   */
  SESSION_ID = 'dvmclcks',

  /**
   * Уникальный идентификатор устройства.
   */
  DEVICE_ID = 'dvmclckf',

  /**
   * Уникальный идентификатор визита пользователя на сайт.
   */
  VISIT_ID = 'dvmclckv',
}

export default CookieKey;
