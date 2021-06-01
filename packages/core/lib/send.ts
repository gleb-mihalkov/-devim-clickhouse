import { createHeaders } from './createHeaders';
import { getUserAgent } from './getUserAgent';
import { createBody } from './createBody';
import { getConfig } from './config';

/**
 * Отправляет указанное событие в сервис аналитики.
 * @param event Название события.
 * @param userId Опциональный идентификатор текущего пользователя.
 * @param payload Опциональный дополнительный параметр события.
 */
export const send = async (event: string, userId?: string, payload?: any) => {
  const { url, id } = getConfig();

  const headers = createHeaders({
    [`Content-Type`]: 'application/json',
    [`Accept`]: 'application/json',
    [`User-Agent`]: getUserAgent(),
    [`X-UserID`]: userId,
    [`X-API-KEY`]: id || undefined,
  });

  const body = createBody({
    event,
    eventValue: payload,
  });

  if (url) {
    try {
      await fetch(url, {
        headers,
        method: 'post',
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error(error);
    }
  } else {
    await Promise.resolve();
  }
};
