import { Params } from './Params';
import { createHeaders } from './createHeaders';
import { createBody } from './createBody';
import { stringifyTimezone } from './stringifyTimezone';
import { stringifyTime } from './stringifyTime';
import { getScreenHeight } from './getScreenHeight';
import { getScreenWidth } from './getScreenWidth';
import { getFingerprint } from './getFingerprint';
import { getIsIncognito } from './getIsIncognito';
import { getUtmSource } from './getUtmSource';
import { getUserAgent } from './getUserAgent';
import { getSessionId } from './getSessionId';
import { getReferrer } from './getReferrer';
import { getTimeZone } from './getTimeZone';
import { getConfig } from './config';

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
