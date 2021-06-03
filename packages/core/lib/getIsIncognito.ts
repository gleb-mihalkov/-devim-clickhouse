/**
 * Возвращает `true`, если пользователь использует режим "Инкогнито".
 * @see https://gist.github.com/jherax/a81c8c132d09cc354a0e2cb911841ff1#file-is-private-mode-ts
 */
export const getIsIncognito = () => {
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
};
