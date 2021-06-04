/**
 * Возвращает часовой пояс пользователя в формате `GMT+0`.
 * @param offset Смещение (в часах) относительно Гринвича. То есть, `3` для
 * Москвы или, например, `-4` для Нью-Йорка.
 */
export const stringifyTimezone = (offset: number) => {
  const sign = offset >= 0 ? '+' : '';
  return `GMT${sign}${offset}`;
};
