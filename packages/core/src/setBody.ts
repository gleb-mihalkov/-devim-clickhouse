/**
 * Преобразует переданное значение в формат, пригодный для отправки в теле
 * запроса к API.
 * @param value Исходное значение.
 */
const mapValue = (value: any) => {
  if (value == null) {
    return null;
  }

  if (typeof value === 'boolean') {
    return Number(value);
  }

  return value;
};

/**
 * Дополняет исходное тело запроса к сервису указанными значениями и возвращает
 * новый объект. Если какое-либо из значений будет равно `null` или `undefined`,
 * в итоговую коллекцию будет подставлено `null`.
 * @param body Исходное тело запроса к сервису.
 * @param values Коллекция новых значений.
 */
export const setBody = (
  body: Record<string, any>,
  values: Record<string, any>
) => {
  const keys = Object.keys(values);
  const { length } = keys;

  let nextBody: Record<string, string> = body;

  for (let i = 0; i < length; i += 1) {
    const key = keys[i];
    const value = mapValue(values[key]);

    nextBody = {
      ...nextBody,
      [key]: value,
    };
  }

  return nextBody;
};
