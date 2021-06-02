/**
 * Возвращает домен, который используется для хранения куков.
 */
export const getDomain = () => {
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
