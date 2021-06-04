import * as Cookie from 'js-cookie';
import { v4 } from 'uuid';

import { getDomain } from './getDomain';

/**
 * Названиек ключа, по которому значение хранится в куках.
 */
const KEY = 'dvmclckf';

/**
 * Возвращает уникальный идентификатор устройства, на котором пользователь
 * просматривает сайт.
 */
export const getFingerprint = () => {
  if (typeof location === 'undefined') {
    return undefined;
  }

  let fingerprint: string | undefined = Cookie.get(KEY);

  if (fingerprint != null) {
    return fingerprint;
  }

  fingerprint = v4();

  Cookie.set(KEY, fingerprint, {
    domain: getDomain(),
    expires: 365,
  });

  return fingerprint;
};
