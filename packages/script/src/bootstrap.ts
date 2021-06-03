import { flushEvents } from './flushEvents';
import { isEvent } from './isEvent';
import { Event } from './Event';

/**
 * Указывает, были ли добавлены специальные обработчики глобальному массиву
 * событий.
 */
let isBootstrapped: boolean = false;

/**
 * Находит глобальный массив с событиями метрики и проксирует его таким
 * образом, чтобы при изменении массива события отправлялись на сервер.
 */
export const bootstrap = () => {
  if (isBootstrapped) {
    return;
  }

  if (window.devimClickhouse == null) {
    throw new Error(`window.devimClickhouse is undefined`);
  }

  flushEvents(window.devimClickhouse);

  window.devimClickhouse = new Proxy(window.devimClickhouse, {
    set: (target: Event[], property: string | symbol, value: any) => {
      // @ts-ignore
      target[property] = value;

      if (isEvent(value)) {
        value.time = new Date();
      }

      flushEvents(target);

      return true;
    },
  });

  isBootstrapped = true;
};
