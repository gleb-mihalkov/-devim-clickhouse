/**
 * Содержит методы для формирования запроса к API.
 */
export default class RequestHelper {
  /**
   * Создаёт заголовки запроса к API из указанной коллекции значений.
   * @param values Коллекция значений.
   */
  public static createHeaders(
    values: Record<string, string | number | boolean | null | undefined>
  ) {
    const keys = Object.keys(values);
    const { length } = keys;

    const headers: Record<string, string> = {};

    for (let i = 0; i < length; i += 1) {
      const key = keys[i];
      const value = values[key];

      if (value != null) {
        headers[key] =
          typeof value === 'boolean' ? String(Number(value)) : String(value);
      }
    }

    return headers;
  }

  /**
   * Создаёт тело запроса к API из указанной коллекции значений.
   * @param values Коллекция значений.
   */
  public static createBody(
    values: Record<string, string | number | boolean | null | undefined>
  ) {
    const body: Record<string, string | number | null> = {};
    const keys = Object.keys(values);
    const { length } = keys;

    for (let i = 0; i < length; i += 1) {
      const key = keys[i];
      const value = values[key];

      if (value == null) {
        body[key] = null;
      } else {
        body[key] = typeof value === 'boolean' ? Number(value) : value;
      }
    }

    return JSON.stringify(body);
  }

  /**
   * Преобразует указанную дату и время в строку, пригодную для отправки в API.
   * @param time Дата и время.
   * @returns
   */
  public static formatTime(time: Date) {
    const stringify = (value: number) =>
      value < 10 ? `0${value}` : String(value);

    const year = stringify(time.getFullYear());
    const month = stringify(time.getMonth() + 1);
    const days = stringify(time.getDate());
    const hours = stringify(time.getHours());
    const minutes = stringify(time.getMinutes());
    const seconds = stringify(time.getSeconds());

    return `${year}-${month}-${days} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * Преобразует смещенение относительно Гринвича (в часах) в строку, пригодную
   * для отправки в API.
   * @param offset Смещение (в часах) относительно нулевого меридиана.
   * @returns
   */
  public static formatTimezone(offset: number) {
    const sign = offset >= 0 ? '+' : '';
    return `GMT${sign}${offset}`;
  }
}
