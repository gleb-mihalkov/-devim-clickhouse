import { createHeaders } from './createHeaders';
import { getUserAgent } from './getUserAgent';
import { createBody } from './createBody';
import { stringifyTime } from './stringifyTime';
import { getTimeZone } from './getTimeZone';
import { getScreenHeight } from './getScreenHeight';
import { getScreenWidth } from './getScreenWidth';
import { getConfig } from './config';

/**
 * Дополнительные параметры события.
 */
type Params = {
  /**
   * Уникальный идентификатор авторизованного пользователя.
   */
  userId?: string;

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
};

/**
 * Отправляет указанное событие в сервис аналитики.
 * @param event Название события.
 * @param params Дополнительные параметры события.
 */
export const send = async (event: string, params: Params = {}) => {
  const { url, id } = getConfig();

  const headers = createHeaders({
    [`Content-Type`]: 'application/json',
    [`Accept`]: 'application/json',
    [`User-Agent`]: getUserAgent(),
    [`X-UserID`]: params.userId,
    [`X-API-KEY`]: id || undefined,
    [`X-SessionID`]: undefined,
  });

  const body = createBody({
    event,
    eventValue: params.payload,
    fingerprintID: undefined,
    referer: undefined,
    source: undefined,
    screenWidth: getScreenWidth(),
    screenHeight: getScreenHeight(),
    timeZone: getTimeZone(),
    region: undefined,
    isIncognito: undefined,
    localTime: stringifyTime(params.time ?? new Date()),
  });

  if (params.verbose && typeof console !== 'undefined') {
    console.debug('clickhouse_event', { ...headers, ...body });
  }

  if (url) {
    try {
      await fetch(url, {
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
