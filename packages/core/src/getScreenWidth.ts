/**
 * Возвращает ширину экрана пользователя.
 */
export const getScreenWidth = () =>
  typeof screen === 'undefined' ? undefined : screen.width;
