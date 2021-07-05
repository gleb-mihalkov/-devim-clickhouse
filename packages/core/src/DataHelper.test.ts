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

import DataHelper from './DataHelper';
import CookieKey from './CookieKey';

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
    it('should work', () => {
      DataHelper.getUserAgent();
    });
  });

  describe(`${CLASS}.getReferrer`, () => {
    it('should work', () => {
      DataHelper.getReferrer();
    });
  });

  describe(`${CLASS}.getSearch`, () => {
    it('should returns an empty object for an empty string', () => {
      expect(DataHelper.getSearch('')).toEqual({});
    });

    it(`should ignore trailing ?`, () => {
      expect(DataHelper.getSearch('?')).toEqual({});
    });

    it(`should parse a simple parameters`, () => {
      expect(DataHelper.getSearch('foo=foo&bar=bar')).toEqual({
        foo: 'foo',
        bar: 'bar',
      });
    });

    it(`should ignore a trailing &`, () => {
      expect(DataHelper.getSearch('foo=bar&')).toEqual({
        foo: 'bar',
      });
    });

    it(`should ignore unessesary &`, () => {
      expect(DataHelper.getSearch('?foo=foo&&bar=bar&')).toEqual({
        foo: 'foo',
        bar: 'bar',
      });
    });

    it(`should parse an empty values`, () => {
      expect(DataHelper.getSearch('foo=&bar&xyz=xyz')).toEqual({
        foo: '',
        bar: '',
        xyz: 'xyz',
      });
    });

    it(`should decode values or keys`, () => {
      expect(
        DataHelper.getSearch('%D1%84%D1%83%D1%83=%D0%B1%D0%B0%D1%80')
      ).toEqual({
        фуу: 'бар',
      });
    });

    it(`should use first meet key in a row`, () => {
      expect(DataHelper.getSearch('foo=foo&foo=bar')).toEqual({
        foo: 'foo',
      });
    });

    it(`should read a single key`, () => {
      expect(DataHelper.getSearch('foo')).toEqual({
        foo: '',
      });
    });

    it(`should work with default search`, () => {
      expect(DataHelper.getSearch()).toEqual({});
    });
  });

  describe(`${CLASS}.getScreenHeight`, () => {
    it('should work', () => {
      DataHelper.getScreenHeight();
    });
  });

  describe(`${CLASS}.getScreenWidth`, () => {
    it('should work', () => {
      DataHelper.getScreenWidth();
    });
  });

  describe(`${CLASS}.getIsIncognito`, () => {
    it('should work', () => {
      return expect(DataHelper.getIsIncognito()).resolves.toBe(false);
    });
  });

  describe(`${CLASS}.getTimeZone`, () => {
    it('should work', () => {
      expect(DataHelper.getTimeZone()).toBe(0);
    });
  });

  describe(`${CLASS}.getTime`, () => {
    it('should work', () => {
      expect(DataHelper.getTime());
    });
  });
});
