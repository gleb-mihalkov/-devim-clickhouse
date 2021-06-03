import { Params } from '@devim-clickhouse/core';

/**
 * Событие метрики.
 */
export type Event = Params & {
  /**
   * Название события.
   */
  type: string;
};
