import { setHeaders } from './setHeaders';

/**
 * Создаёт коллекцию заголовков запроса к сервису на основе указанной коллекции
 * значений. Если значение из коллекции равно `undefined`, к заголовкам оно
 * добавлено не будет.
 * @param values Коллекция значений.
 */
export const createHeaders = (values: Record<string, string | void>) =>
  setHeaders({}, values);
