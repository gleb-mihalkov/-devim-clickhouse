import { getConfig, setConfig } from './config';

/**
 * Инициализирует сервис отправки событий.
 * @param url Адрес ClickHouse API.
 * @param id Уникальный идентификатор сайта.
 */
export const initialize = (url: string, id: string) => {
  const config = getConfig();

  if (config.url !== url || config.id !== id) {
    setConfig({ url, id });
  }
};
