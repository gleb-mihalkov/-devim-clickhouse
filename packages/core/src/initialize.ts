import { Config, setConfig } from './config';

/**
 * Инициализирует сервис отправки событий.
 * @param config Объект конфигурации.
 */
export const initialize = (config: Config) => {
  setConfig(config);
};
