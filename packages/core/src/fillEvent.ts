import { getScreenHeight } from './getScreenHeight';
import { getScreenWidth } from './getScreenWidth';
import { getFingerprint } from './getFingerprint';
import { getIsIncognito } from './getIsIncognito';
import { getSearchValue } from './getSearchValue';
import { getUserAgent } from './getUserAgent';
import { getSessionId } from './getSessionId';
import { getReferrer } from './getReferrer';
import { getTimeZone } from './getTimeZone';
import { getHref } from './getHref';
import { Event } from './Event';

/**
 * Заполняет незаполненные поля указанного события значениями по умолчанию.
 * @param event Событие.
 */
export const fillEvent = async (event: Event) => {
  event.fingerprint = event.fingerprint ?? getFingerprint();
  event.sessionId = getSessionId(event.logout);

  event.userAgent = event.userAgent ?? getUserAgent();
  event.referrer = event.referrer ?? getReferrer();

  event.utmCampaign = event.utmCampaign ?? getSearchValue('utm_campaign');
  event.utmContent = event.utmContent ?? getSearchValue('utm_content');
  event.utmSource = event.utmSource ?? getSearchValue('utm_source');
  event.utmMedium = event.utmMedium ?? getSearchValue('utm_medium');
  event.utmTerm = event.utmTerm ?? getSearchValue('utm_term');

  event.screenHeight = event.screenHeight ?? getScreenHeight();
  event.screenWidth = event.screenWidth ?? getScreenWidth();

  event.isIncognito = event.isIncognito ?? (await getIsIncognito());

  event.timezone = event.timezone ?? getTimeZone();
  event.time = event.time ?? new Date();

  event.href = event.href ?? getHref();
};
