/**
 * Возвращает `user-agent` текущего устройства пользователя или `undefined`,
 * если его не удалось определить.
 *
 * Определение происходит на основе свойства `navigator.userAgent`.
 */
export const getUserAgent = () =>
  typeof navigator === 'undefined' ? undefined : navigator.userAgent;
