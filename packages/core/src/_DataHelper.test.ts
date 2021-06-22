let mockCookieValues: Record<string, string> = {};

jest.mock('js-cookie', () => ({
  get: jest.fn((name: string) => mockCookieValues[name]),

  set: jest.fn((name: string, value: string) => {
    mockCookieValues[name] = value;
  }),

  remove: jest.fn((name: string) => {
    delete mockCookieValues[name];
  }),
}));

import DataHelper from './_DataHelper';
import CookieKey from './_CookieKey';

const CLASS = 'DataHelper';

beforeEach(() => {
  mockCookieValues = {};
});

afterAll(() => {
  jest.unmock('js-cookie');
});

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
    it('should set an ID into cookie if it is undefined', () => {
      const deviceId = DataHelper.getDeviceId();
      expect(deviceId).toBe(mockCookieValues[CookieKey.DEVICE_ID]);
    });

    it(`should return an existing ID from cookies`, () => {
      mockCookieValues[CookieKey.DEVICE_ID] = 'foo';
      expect(DataHelper.getDeviceId()).toBe('foo');
    });
  });

  describe(`${CLASS}.getSessionId`, () => {
    it('should generate a new ID if it is undefined', () => {
      expect(DataHelper.getSessionId()).toBe(
        mockCookieValues[CookieKey.SESSION_ID]
      );
    });

    it(`should return an existing ID from cookies`, () => {
      mockCookieValues[CookieKey.SESSION_ID] = 'foo';
      expect(DataHelper.getSessionId()).toBe('foo');
    });

    it(`should renews an ID if a flag is specified`, () => {
      mockCookieValues[CookieKey.SESSION_ID] = 'foo';
      expect(DataHelper.getSessionId(true)).not.toBe('foo');
    });
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
