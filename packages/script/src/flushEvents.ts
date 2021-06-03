import { initialize, send } from '@devim-clickhouse/core';

import { isEvent } from './isEvent';
import { Event } from './Event';

/**
 * Отправляет все события, сохранённые в указанном массиве и очищает его.
 * @param events Массив событий.
 */
export const flushEvents = (events: any[]) => {
  while (events.length > 0) {
    const value = events.shift();

    if (!isEvent(value)) {
      continue;
    }

    const { type, ...params } = value as Event;

    if (type !== 'initialize') {
      send(type, params);
      continue;
    }

    const { payload } = params;

    if (typeof payload !== 'object') {
      continue;
    }

    const { url, id } = payload;

    if (!url || !id) {
      continue;
    }

    initialize(url, id);
  }
};
