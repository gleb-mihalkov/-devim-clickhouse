import { Service, Config } from '@devim-clickhouse/core';

import isEvent from './isEvent';
import Event from './Event';

/**
 * Экземпляр сервиса Clickhouse API, используемый в данный момент.
 */
let service: Service = new Service();

/**
 * Отправляет все события, сохранённые в указанном массиве и очищает его.
 * @param events Массив событий.
 */
export default function flush(events: any[]) {
  while (events.length > 0) {
    const value = events.shift();

    if (!isEvent(value)) {
      continue;
    }

    const { type, ...params } = value as Event;

    if (type !== 'initialize') {
      service.send(type, params);
      continue;
    }

    const { payload } = params;

    let config: Config = {};

    if (typeof payload === 'object') {
      const { beforeAssignDefaults, beforeSend, verbose, url, id } = payload;
      config = { beforeAssignDefaults, beforeSend, verbose, url, id };
    }

    service = new Service(config);
    service.sendVisit();
  }
}
