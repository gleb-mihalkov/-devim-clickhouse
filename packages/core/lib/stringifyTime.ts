/**
 * Преобразует компонент даты или времени в строку.
 * @param value Число.
 */
const toString = (value: number) => (value < 10 ? `0${value}` : String(value));

/**
 * Преобразует указанный объект даты в формат `YYYY-MM-DD HH:MM:SS`.
 * @param date Дата.
 */
export const stringifyTime = (date: Date) => {
  const year = toString(date.getFullYear());
  const month = toString(date.getMonth() + 1);
  const days = toString(date.getDate());
  const hours = toString(date.getHours());
  const minutes = toString(date.getMinutes());
  const seconds = toString(date.getSeconds());

  return `${year}-${month}-${days} ${hours}:${minutes}:${seconds}`;
};
