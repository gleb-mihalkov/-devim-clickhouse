import { stringifyTimezone } from './stringifyTimezone';

/**
 * Возвращает номер временной зоны пользователя в формате 'GMT+3'.
 */
export const getTimeZone = () => {
  let offset = new Date().getTimezoneOffset();
  offset *= -1;
  offset /= 60;
  offset = Math.ceil(offset);
  return stringifyTimezone(offset);
};