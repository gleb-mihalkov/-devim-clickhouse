/**
 * Проверяет, является ли переданное значение событием.
 * @param value Значение.
 */
export default function isEvent(value: any) {
  return typeof value === 'object' && typeof value.type === 'string';
}
