import memoize from 'memoize-one';

/**
 * Декодированная коллекция параметров адреса страницы.
 */
type Params = Record<string, string | string[]>;

/**
 * Возвращает коллекцию параметров адреса страницы.
 * @param search Сегмент запроса адреса страницы без символа "?".
 */
const parseSearch = memoize((search: string) => {
  const chunks = search.split(/&/g);
  const { length } = chunks;

  const params: Params = {};

  for (let i = 0; i < length; i += 1) {
    const chunk = chunks[i];

    if (!chunk) {
      continue;
    }

    let [title, value = ''] = chunk.split('=');

    value = decodeURIComponent(value);
    title = decodeURIComponent(title);

    let element = params[title];

    if (element) {
      if (typeof element === 'string') {
        element = [element];
      }

      element.push(value);
    } else {
      params[title] = value;
    }
  }

  return params;
});

/**
 * Возвращает коллекцию параметров адреса текущей страницы.
 */
export const getSearchParams = () => {
  if (typeof location === 'undefined') {
    return {};
  }

  const search = location.search.replace(/^\?/, '');
  return parseSearch(search);
};
