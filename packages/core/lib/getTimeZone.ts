/**
 * Возвращает номер временной зоны пользователя в формате 'GMT+3'.
 */
export const getTimeZone = () => {
  let offset = new Date().getTimezoneOffset();
  offset *= -1;
  offset /= 60;
  offset = Math.ceil(offset);

  const sign = offset >= 0 ? '+' : '';
  return `GMT${sign}${offset}`;
};
