/**
 * Возвращает полный адрес текущей страницы или `undefined`, если определить
 * его невозможно (к примеру, код вызывается на сервере).
 */
export const getHref = () =>
  typeof location === 'undefined' ? undefined : location.href;
