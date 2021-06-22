import { enableFetchMocks } from 'jest-fetch-mock';

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

enableFetchMocks();

jest.spyOn(console, 'debug').mockImplementation(() => {});

import RequestHelper from './_RequestHelper';
import CookieKey from './_CookieKey';
import Service from './_Service';
import Event from './_Event';

const CLASS = 'Service';

beforeEach(() => {
  mockCookieValues = {};
});

afterEach(() => {
  jest.clearAllMocks();
});

describe(`${CLASS}`, () => {
  describe(`${CLASS}.constructor`, () => {
    function getConfig(service: Service) {
      // @ts-ignore
      return service.config;
    }

    it('should work', () => {
      const service = new Service({
        url: 'foo',
        id: 'bar',
      });

      expect(getConfig(service)).toEqual({
        url: 'foo',
        id: 'bar',
      });
    });
  });

  describe(`${CLASS}.assignDefaults`, () => {
    function fn(event: Event) {
      const service = new Service();
      // @ts-ignore
      return service.assignDefaults(event);
    }

    it('should assigns sessionID and deviceID', async () => {
      const event: Event = { name: 'foo' };
      await fn(event);

      expect(event.sessionId).toBe(mockCookieValues[CookieKey.SESSION_ID]);
      expect(event.deviceId).toBe(mockCookieValues[CookieKey.DEVICE_ID]);
    });

    it(`should replace a value only if it isn't exists in event`, async () => {
      const event: Event = { name: 'foo', deviceId: undefined };
      await fn(event);

      expect(event.deviceId).toBeUndefined();
    });

    it(`shouldn't assign an UTM parameters if one of it is defined`, async () => {
      const event: Event = { name: 'foo', utmSource: 'bar' };
      await fn(event);

      expect(event.utmSource).toBe('bar');
    });
  });

  describe(`${CLASS}.beforeSend`, () => {
    function invoke(service: Service, event: Event) {
      // @ts-ignore
      return service.beforeSend(event);
    }

    it('should trigger a function from config', async () => {
      const fn = jest.fn((event: Event) => {
        event.name = 'bar';
      });

      const service = new Service({ beforeSend: fn });
      const event: Event = { name: 'foo' };

      await invoke(service, event);

      expect(fn).toBeCalledTimes(1);
      expect(event.name).toBe('bar');
    });

    it(`should do nothing if a function from config is undefined`, async () => {
      const service = new Service();
      const event: Event = { name: 'foo' };

      await invoke(service, event);
    });
  });

  describe(`${CLASS}.getHeaders`, () => {
    function invoke(service: Service, event: Event) {
      // @ts-ignore
      return service.getHeaders(event);
    }

    it('should work', async () => {
      const service = new Service({ id: 'foo' });
      const event: Event = { name: 'bar', userId: 'xyz' };

      // @ts-ignore
      await service.assignDefaults(event);

      const headers = await invoke(service, event);

      expect(headers).toEqual({
        [`Content-Type`]: 'application/json',
        [`Accept`]: 'application/json',
        [`User-Agent`]: navigator.userAgent,
        [`X-UserID`]: 'xyz',
        [`X-API-KEY`]: 'foo',
        [`X-SessionID`]: mockCookieValues[CookieKey.SESSION_ID],
      });
    });
  });

  describe(`${CLASS}.getBody`, () => {
    function invoke(service: Service, event: Event) {
      // @ts-ignore
      return service.getBody(event);
    }

    it('should work', async () => {
      const service = new Service();
      const event: Event = { name: 'bar', userId: 'xyz' };

      const now = new Date();

      // @ts-ignore
      await service.assignDefaults(event);

      const body = await invoke(service, event);

      expect(body).toBe(
        JSON.stringify({
          event: 'bar',
          eventValue: null,
          fingerprintID: mockCookieValues[CookieKey.DEVICE_ID],
          referer: '',
          source: null,
          campaign: null,
          medium: null,
          content: null,
          term: null,
          screenHeight: 0,
          screenWidth: 0,
          isIncognito: 0,
          localTime: RequestHelper.formatTime(now),
          timeZone: 'GMT+0',
          page: location.href,
        })
      );
    });
  });

  describe(`${CLASS}.fetch`, () => {
    function invoke(service: Service, event: Event) {
      // @ts-ignore
      return service.fetch(event);
    }

    it('should fetch a data if config.url and config.id is presented', async () => {
      const service = new Service({ url: 'foo', id: 'bar' });
      const event: Event = { name: 'foo' };

      // @ts-ignore
      await service.assignDefaults(event);
      await invoke(service, event);

      expect(fetch).toBeCalled();
    });

    it(`shouldn't fetch a data if config.url or config.id is undefined`, async () => {
      const service = new Service();
      await invoke(service, { name: 'foo' });

      expect(fetch).not.toBeCalled();
    });
  });

  describe(`${CLASS}.log`, () => {
    function invoke(service: Service, event: Event) {
      // @ts-ignore
      service.log(event);
    }

    it(`should log if config.verbose is true`, () => {
      const service = new Service({ verbose: true });
      const event: Event = { name: 'foo' };

      invoke(service, event);

      expect(console.debug).toBeCalled();
    });

    it(`shouldn't log if config.verbose is falsy`, () => {
      const service = new Service({ verbose: false });
      const event: Event = { name: 'foo' };

      invoke(service, event);

      expect(console.debug).not.toBeCalled();
    });
  });

  describe(`${CLASS}.send`, () => {
    it(`should do nothing if config isn't presented`, async () => {
      const service = new Service();
      await service.send('bar');

      expect(console.debug).not.toBeCalled();
      expect(fetch).not.toBeCalled();
    });

    it(`should work if config is presented`, async () => {
      const beforeSend = jest.fn(() => {});

      const service = new Service({
        beforeSend,
        url: 'foo',
        id: 'bar',
        verbose: true,
      });

      await service.send('foo');

      expect(console.debug).toBeCalled();
      expect(beforeSend).toBeCalled();
      expect(fetch).toBeCalled();
    });
  });
});
