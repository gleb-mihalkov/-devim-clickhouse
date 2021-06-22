import * as Cookie from 'js-cookie';
import { v4 } from 'uuid';

import CookieKey from './_CookieKey';

/**
 * Содержит методы для получения пользовательских данных из браузера.
 */
export default class DataHelper {
  /**
   * Возвращает полный адрес текущей страницы (к примеру,
   * `https://sample.com/pathname?query=`). Если адрес определить не удалось
   * (допустим, код был вызван на сервере), метод возвращает `undefined`.
   */
  public static getHref() {
    return typeof location === 'undefined' ? undefined : location.href;
  }

  /**
   * Возвращает домен, который используется для хранения куков.
   * @param hostname Полное название хоста.
   */
  private static getDomain(hostname: string = location.hostname) {
    const local = hostname.indexOf('.') < 0;

    if (local) {
      return hostname;
    }

    const ip = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname);

    if (ip) {
      return hostname;
    }

    const match = hostname.match(/[^.]+\.[^.]+$/);

    if (match == null) {
      return hostname;
    }

    return match[0];
  }

  /**
   * Возвращает уникальный идентификатор устройства, на котором пользователь
   * просматривает сайт.
   */
  public static getDeviceId() {
    if (typeof location === 'undefined') {
      return undefined;
    }

    let fingerprint: string | undefined = Cookie.get(CookieKey.DEVICE_ID);

    if (fingerprint) {
      return fingerprint;
    }

    fingerprint = v4();

    Cookie.set(CookieKey.DEVICE_ID, fingerprint, {
      domain: this.getDomain(),
      expires: 365,
    });

    return fingerprint;
  }

  /**
   * Возвращает уникальный идентификатор сессии клиента.
   * @param renew Указывает, что идентификатор следует обновить.
   */
  public static getSessionId(renew?: boolean) {
    let id = Cookie.get(CookieKey.SESSION_ID);

    if (renew || !id) {
      id = v4();
      Cookie.set(CookieKey.SESSION_ID, id, { domain: this.getDomain() });
    }

    return id;
  }

  /**
   * Возвращает `user-agent` текущего устройства пользователя или `undefined`,
   * если его не удалось определить.
   *
   * Определение происходит на основе свойства `navigator.userAgent`.
   */
  public static getUserAgent() {
    return typeof navigator === 'undefined' ? undefined : navigator.userAgent;
  }

  /**
   * Возвращает содержимое заголовка Referrer запроса к текущей странице.
   */
  public static getReferrer() {
    return typeof document === 'undefined' ? undefined : document.referrer;
  }

  /**
   * Возвращает коллекцию параметров адреса текущей страницы.
   */
  public static getSearch() {
    if (typeof location === 'undefined') {
      return {};
    }

    const search = location.search.replace(/^\?/, '');

    const chunks = search.split(/&/g);
    const { length } = chunks;

    const params: Record<string, string> = {};

    for (let i = 0; i < length; i += 1) {
      const chunk = chunks[i];

      if (!chunk) {
        continue;
      }

      const [title, value = ''] = chunk.split('=');
      const key = decodeURIComponent(title);

      if (params[key] == null) {
        params[key] = decodeURIComponent(value);
      }
    }

    return params;
  }

  /**
   * Возвращает высоту экрана пользователя.
   */
  public static getScreenHeight() {
    return typeof screen === 'undefined' ? undefined : screen.height;
  }

  /**
   * Возвращает ширину экрана пользователя.
   */
  public static getScreenWidth() {
    return typeof screen === 'undefined' ? undefined : screen.width;
  }

  /**
   * Возвращает `true`, если пользователь использует режим "Инкогнито".
   * @see https://gist.github.com/jherax/a81c8c132d09cc354a0e2cb911841ff1#file-is-private-mode-ts
   */
  public static getIsIncognito() {
    return new Promise<boolean | undefined>((resolve) => {
      const yes = () => resolve(true); // is in private mode
      const not = () => resolve(false); // not in private mode

      if (typeof window === 'undefined') {
        return resolve(undefined);
      }

      function detectChromeOpera(): boolean {
        // https://developers.google.com/web/updates/2017/08/estimating-available-storage-space
        const isChromeOpera =
          /(?=.*(opera|chrome)).*/i.test(navigator.userAgent) &&
          navigator.storage?.estimate;

        if (isChromeOpera) {
          navigator.storage.estimate().then(({ quota }) => {
            (quota ?? 0) < 120000000 ? yes() : not();
          });
        }

        return Boolean(isChromeOpera);
      }

      function detectFirefox(): boolean {
        const isMozillaFirefox =
          'MozAppearance' in document.documentElement.style;

        if (isMozillaFirefox) {
          if (indexedDB == null) yes();
          else {
            const db = indexedDB.open('inPrivate');
            db.onsuccess = not;
            db.onerror = yes;
          }
        }

        return isMozillaFirefox;
      }

      function detectSafari(): boolean {
        const isSafari = navigator.userAgent.match(
          /Version\/([0-9\._]+).*Safari/
        );

        if (isSafari) {
          const testLocalStorage = () => {
            try {
              if (localStorage.length) not();
              else {
                localStorage.setItem('inPrivate', '0');
                localStorage.removeItem('inPrivate');
                not();
              }
            } catch (_) {
              // Safari only enables cookie in private mode
              // if cookie is disabled, then all client side storage is disabled
              // if all client side storage is disabled, then there is no point
              // in using private mode
              navigator.cookieEnabled ? yes() : not();
            }

            return true;
          };

          const version = parseInt(isSafari[1], 10);

          if (version < 11) {
            return testLocalStorage();
          }

          try {
            (window as any).openDatabase(null, null, null, null);
            not();
          } catch (_) {
            yes();
          }
        }

        return Boolean(isSafari);
      }

      function detectEdgeIE10(): boolean {
        const isEdgeIE10 =
          // @ts-ignore
          !window.indexedDB && (window.PointerEvent || window.MSPointerEvent);

        if (isEdgeIE10) {
          yes();
        }

        return Boolean(isEdgeIE10);
      }

      // when a browser is detected, it runs tests for that browser
      // and skips pointless testing for other browsers.
      if (detectChromeOpera()) {
        return;
      }

      if (detectFirefox()) {
        return;
      }

      if (detectSafari()) {
        return;
      }

      if (detectEdgeIE10()) {
        return;
      }

      // default navigation mode
      return not();
    });
  }

  /**
   * Возвращает номер временной зоны пользователя в формате 'GMT+3'.
   * @param time Объект даты / времени, из которого нужно извлечь смещение.
   */
  public static getTimeZone(time: Date = new Date()) {
    let offset = time.getTimezoneOffset();
    offset *= -1;
    offset /= 60;
    offset = Math.ceil(offset);
    return offset;
  }

  /**
   * Возвращает текущие дату и время.
   */
  public static getTime() {
    return new Date();
  }
}
