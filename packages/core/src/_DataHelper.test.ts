import DataHelper from './_DataHelper';

const CLASS = 'DataHelper';

describe(`${CLASS}`, () => {
  describe(`${CLASS}.getHref`, () => {
    it('should return a current location.href', () => {
      expect(DataHelper.getHref()).toBe(location.href);
    });
  });

  describe(`${CLASS}.getDomain`, () => {
    function fn(...args: any[]) {
      // @ts-ignore
      return DataHelper.getDomain(...args);
    }

    it(`should return a first-level domain as is`, () => {
      expect(fn('google.com')).toBe('google.com');
    });

    it(`should return a first-level domain for a sub-domain`, () => {
      expect(fn('accounts.google.com')).toBe('google.com');
    });

    it(`should return a first-level domain of three-or-more leveled hostname`, () => {
      expect(fn('v1.accounts.google.com')).toBe('google.com');
    });

    it(`should return an IP as is`, () => {
      expect(fn('127.0.0.1')).toBe('127.0.0.1');
    });

    it(`should return a local alias of domain as is`, () => {
      expect(fn('localhost')).toBe('localhost');
    });
  });

  describe(`${CLASS}.getDeviceId`, () => {
    // TODO: implement
    it('mock', () => {});
  });

  describe(`${CLASS}.getSessionId`, () => {
    // TODO: implement
    it('mock', () => {});
  });

  describe(`${CLASS}.getUserAgent`, () => {
    // TODO: implement
    it('mock', () => {});
  });

  describe(`${CLASS}.getReferrer`, () => {
    // TODO: implement
    it('mock', () => {});
  });

  describe(`${CLASS}.getSearch`, () => {
    // TODO: implement
    it('mock', () => {});
  });

  describe(`${CLASS}.getScreenHeight`, () => {
    // TODO: implement
    it('mock', () => {});
  });

  describe(`${CLASS}.getScreenWidth`, () => {
    // TODO: implement
    it('mock', () => {});
  });

  describe(`${CLASS}.getIsIncognito`, () => {
    // TODO: implement
    it('mock', () => {});
  });

  describe(`${CLASS}.getTimeZone`, () => {
    // TODO: implement
    it('mock', () => {});
  });

  describe(`${CLASS}.getTime`, () => {
    // TODO: implement
    it('mock', () => {});
  });
});
