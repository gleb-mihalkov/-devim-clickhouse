import { Event } from './Event';

declare global {
  /**
   * Глобальный массив, в который добавляются события метрики.
   */
  var devimClickhouse: Event[] | undefined;
}
