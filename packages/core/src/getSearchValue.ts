import { getSearchParams } from './getSearchParams';

/**
 * Возвращает декодированное значение указанного параметра из адреса текущей
 * страницы или `undefined`, если он не указан. Если же в адресе было передано
 * несколько параметров с указанным именем, будет возвращено первое значение.
 * @param name Название параметра.
 */
export const getSearchValue = (name: string) => {
  const params = getSearchParams();
  const value = params[name];

  if (value == null) {
    return undefined;
  }

  return typeof value === 'string' ? value : value[0];
};
