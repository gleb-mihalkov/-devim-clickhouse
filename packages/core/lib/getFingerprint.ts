import { get, set } from 'js-cookie';
import { v4 } from 'uuid';

/**
 * Названиек ключа, по которому значение хранится в куках.
 */
const KEY = 'dvmclckf';

/**
 * Возвращает домен, который используется для хранения куков.
 */
const getDomain = () => {
  const { hostname } = location;

  const local = hostname.indexOf('.') < 0;

  if (local) {
    return hostname;
  }

  const ip = /^\d{4}\.\d{4}\.\d{4}\.\d{4}$/.test(hostname);

  if (ip) {
    return hostname;
  }

  const match = hostname.match(/[^.]+\.[^.]+$/);

  if (match == null) {
    return hostname;
  }

  return match[0];
};

/**
 * Возвращает уникальный идентификатор устройства, на котором пользователь
 * просматривает сайт.
 */
export const getFingerprint = () => {
  if (typeof location === 'undefined') {
    return undefined;
  }

  let fingerprint: string | undefined = get(KEY);

  if (fingerprint != null) {
    return fingerprint;
  }

  const domain = getDomain();
  fingerprint = v4();

  set(KEY, fingerprint, { domain, expires: 365 });

  return fingerprint;
};
