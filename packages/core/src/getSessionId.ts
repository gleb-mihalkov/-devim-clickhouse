import Cookie from 'js-cookie';
import { v4 } from 'uuid';

import { getDomain } from './getDomain';

/**
 * Ключ, по которому значение хранится в куках.
 */
const KEY = 'dvmclcks';

/**
 * Возвращает уникальный идентификатор сессии клиента.
 * @param renew Указывает, что идентификатор следует обновить.
 */
export const getSessionId = (renew?: boolean) => {
  let id = Cookie.get(KEY);

  if (renew || id == null) {
    id = v4();
    Cookie.set(KEY, id, { domain: getDomain() });
  }

  return id;
};
