/**
 * Возвращает содержимое заголовка Referrer запроса к текущей странице.
 */
export const getReferrer = () =>
  typeof document === 'undefined' ? undefined : document.referrer;
