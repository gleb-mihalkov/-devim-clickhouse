/**
 * Добавляет в исходную коллекцию заголовков запроса к сервису указанную
 * коллекцию значений. Если какое-либо из значений равно `undefined`, заголовок
 * добавлен не будет. Возвращает новую коллекцию заголовков.
 * @param headers Исходная коллекция заголовков запроса.
 * @param values Коллекция новых заголовков.
 */
export const setHeaders = (
  headers: Record<string, string>,
  values: Record<string, string | void>
) => {
  const keys = Object.keys(values);
  const { length } = keys;

  let nextHeaders: Record<string, string> = headers;

  for (let i = 0; i < length; i += 1) {
    const key = keys[i];
    const value = values[key];

    if (value == null) {
      continue;
    }

    nextHeaders = {
      ...nextHeaders,
      [key]: value,
    };
  }

  return nextHeaders;
};
