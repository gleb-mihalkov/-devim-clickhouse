import { setBody } from './setBody';

/**
 * Создаёт тело запроса к сервису на основе указанной коллекции
 * значений. Если значение из коллекции равно `undefined`, в итоговый объект
 * будет подставлено `null`.
 * @param values Коллекция значений.
 */
export const createBody = (values: Record<string, string | void>) =>
  setBody({}, values);
