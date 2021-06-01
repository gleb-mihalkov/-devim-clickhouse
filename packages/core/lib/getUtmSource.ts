/**
 * Пытается получить значение `utm_source` из адреса страницы. Если не удаётся
 * (или такой метки у адреса нет), возвращает `undefined`.
 */
export const getUtmSource = () => {
  if (typeof location === 'undefined') {
    return undefined;
  }

  const search = location.search.replace(/^\?/, '');
  const chunks = search.split(/&/g);
  const { length } = chunks;

  for (let i = 0; i < length; i += 1) {
    const chunk = chunks[i];

    if (!chunk) {
      continue;
    }

    const [title, value = ''] = chunk.split('=');

    if (title !== 'utm_source') {
      continue;
    }

    return decodeURIComponent(value);
  }

  return undefined;
};
