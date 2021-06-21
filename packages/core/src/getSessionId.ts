import * as Cookie from 'js-cookie';
import { v4 } from 'uuid';

import { getDomain } from './getDomain';
import { CookieKey } from './CookieKey';

/**
 * Возвращает уникальный идентификатор сессии клиента.
 * @param renew Указывает, что идентификатор следует обновить.
 */
export const getSessionId = (renew?: boolean) => {
  let id = Cookie.get(CookieKey.SESSION_ID);

  if (renew || !id) {
    id = v4();
    Cookie.set(CookieKey.SESSION_ID, id, { domain: getDomain() });
  }

  return id;
};
