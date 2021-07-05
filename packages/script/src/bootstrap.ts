import flush from './flush';
import Event from './Event';

/**
 * Указывает, были ли добавлены специальные обработчики глобальному массиву
 * событий.
 */
let isBootstrapped: boolean = false;

/**
 * Находит глобальный массив с событиями метрики и проксирует его таким
 * образом, чтобы при изменении массива события отправлялись на сервер.
 */
export default function bootstrap() {
  if (isBootstrapped) {
    return;
  }

  if (window.devimClickhouse == null) {
    window.devimClickhouse = [];
  }

  flush(window.devimClickhouse);

  window.devimClickhouse = new Proxy(window.devimClickhouse, {
    set: (target: Event[], property: string | symbol, value: any) => {
      // @ts-ignore
      target[property] = value;

      flush(target);

      return true;
    },
  });

  isBootstrapped = true;
}
