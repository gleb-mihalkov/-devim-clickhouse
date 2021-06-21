import * as Cookie from 'js-cookie';
import { v4 } from 'uuid';

import { getDomain } from './getDomain';
import { CookieKey } from './CookieKey';

/**
 * Возвращает уникальный идентификатор устройства, на котором пользователь
 * просматривает сайт.
 */
export const getFingerprint = () => {
  if (typeof location === 'undefined') {
    return undefined;
  }

  let fingerprint: string | undefined = Cookie.get(CookieKey.FINGERPRINT);

  if (fingerprint) {
    return fingerprint;
  }

  fingerprint = v4();

  Cookie.set(CookieKey.FINGERPRINT, fingerprint, {
    domain: getDomain(),
    expires: 365,
  });

  return fingerprint;
};
