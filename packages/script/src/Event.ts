import { Params } from '@devim-clickhouse/core';

/**
 * Событие метрики.
 */
type Event = Params & {
  /**
   * Название события.
   */
  type: string;
};

export default Event;
