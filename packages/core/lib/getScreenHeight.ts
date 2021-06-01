/**
 * Возвращает высоту экрана пользователя.
 */
export const getScreenHeight = () =>
  typeof screen === 'undefined' ? undefined : screen.height;
