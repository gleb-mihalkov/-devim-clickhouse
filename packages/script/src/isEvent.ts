/**
 * Проверяет, является ли переданное значение событием.
 * @param value Значение.
 */
export const isEvent = (value: any) =>
  typeof value === 'object' && typeof value.type === 'string';
