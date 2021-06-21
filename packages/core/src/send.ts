import { Event } from './Event';
import { createHeaders } from './createHeaders';
import { createBody } from './createBody';
import { stringifyTimezone } from './stringifyTimezone';
import { stringifyTime } from './stringifyTime';
import { getConfig } from './config';
import { fillEvent } from './fillEvent';

/**
 * Дополнительные параметры события.
 */
type Params = Omit<Event, 'name' | 'sessionId'>;

/**
 * Отправляет указанное событие в сервис аналитики.
 * @param name Название события.
 * @param params Дополнительные параметры события.
 */
export const send = async (name: string, params: Params = {}) => {
  const event: Event = { name, ...params };

  const config = getConfig();

  if (config.beforeSend) {
    config.beforeSend(event);
  }

  fillEvent(event);

  const headers = createHeaders({
    [`Content-Type`]: 'application/json',
    [`Accept`]: 'application/json',
    [`User-Agent`]: event.userAgent,
    [`X-UserID`]: event.userId,
    [`X-API-KEY`]: config.id || undefined,
    [`X-SessionID`]: event.sessionId,
  });

  const body = createBody({
    event: event.name,
    eventValue: event.payload,
    fingerprintID: event.fingerprint,
    referer: event.referrer,
    source: event.utmSource,
    campaign: event.utmCampaign,
    medium: event.utmMedium,
    content: event.utmContent,
    term: event.utmTerm,
    screenHeight: event.screenHeight,
    screenWidth: event.screenWidth,
    isIncognito: event.isIncognito,
    localTime: stringifyTime(event.time as Date),
    timeZone: stringifyTimezone(event.timezone as number),
    page: event.href,
  });

  if (config.verbose && typeof console !== 'undefined') {
    console.debug('clickhouse_event', event);
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
