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

import RequestHelper from './RequestHelper';
import DataHelper from './DataHelper';
import CookieKey from './CookieKey';
import Service from './Service';
import Event from './Event';

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

  describe(`${CLASS}.beforeAssignDefaults`, () => {
    function invoke(service: Service, event: Event) {
      // @ts-ignore
      return service.beforeAssignDefaults(event);
    }

    it('should trigger a function from config', async () => {
      const fn = jest.fn((event: Event) => {
        event.name = 'bar';
      });

      const service = new Service({ beforeAssignDefaults: fn });
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

  describe(`${CLASS}.assignDefaults`, () => {
    function fn(event: Event) {
      const service = new Service();
      // @ts-ignore
      return service.assignDefaults(event);
    }

    function createEvent(name: string = 'foo') {
      const event: Event = { name };
      return event;
    }

    it('should assigns sessionID and deviceID', async () => {
      const event = createEvent();
      await fn(event);

      expect(event.sessionId).toBe(mockCookieValues[CookieKey.SESSION_ID]);
      expect(event.deviceId).toBe(mockCookieValues[CookieKey.DEVICE_ID]);
    });

    it(`should assign 'sessionId'`, async () => {
      const event = createEvent();
      await fn(event);

      expect(event.sessionId).toBe(mockCookieValues[CookieKey.SESSION_ID]);
    });

    it(`should override 'sessionId' if it defined`, async () => {
      const event = createEvent();
      event.sessionId = 'foo';

      await fn(event);

      expect(event.sessionId).toBe(mockCookieValues[CookieKey.SESSION_ID]);
    });

    it(`should assign 'deviceId'`, async () => {
      const event = createEvent();
      await fn(event);
      expect(event.deviceId).toBe(mockCookieValues[CookieKey.DEVICE_ID]);
    });

    it(`shouldn't override 'deviceId' if it defined`, async () => {
      const event = createEvent();
      event.deviceId = 'foo';
      await fn(event);
      expect(event.deviceId).toBe('foo');
    });

    it(`should assign 'userAgent'`, async () => {
      const event = createEvent();
      await fn(event);
      expect(event.userAgent).toBe(DataHelper.getUserAgent());
    });

    it(`shouldn't override 'userAgent' if it defined`, async () => {
      const event = createEvent();
      event.userAgent = 'foo';
      await fn(event);
      expect(event.userAgent).toBe('foo');
    });

    it(`should assign 'referrer'`, async () => {
      const event = createEvent();
      await fn(event);
      expect(event.referrer).toBe(DataHelper.getReferrer());
    });

    it(`shouldn't override 'referrer' if it defined`, async () => {
      const event = createEvent();
      event.referrer = 'foo';
      await fn(event);
      expect(event.referrer).toBe('foo');
    });

    it(`should assign 'screenHeight'`, async () => {
      const event = createEvent();
      await fn(event);
      expect(event.screenHeight).toBe(DataHelper.getScreenHeight());
    });

    it(`shouldn't override 'screenHeight' if it defined`, async () => {
      const event = createEvent();
      event.screenHeight = 10;
      await fn(event);
      expect(event.screenHeight).toBe(10);
    });

    it(`should assign 'screenWidth'`, async () => {
      const event = createEvent();
      await fn(event);
      expect(event.screenWidth).toBe(DataHelper.getScreenWidth());
    });

    it(`shouldn't override 'screenWidth' if it defined`, async () => {
      const event = createEvent();
      event.screenWidth = 10;
      await fn(event);
      expect(event.screenWidth).toBe(10);
    });

    it(`should assign 'isIncognito'`, async () => {
      const event = createEvent();
      await fn(event);
      const value = await DataHelper.getIsIncognito();
      expect(event.isIncognito).toBe(value);
    });

    it(`shouldn't override 'isIncognito' if it defined`, async () => {
      const event = createEvent();
      event.isIncognito = true;
      await fn(event);
      expect(event.isIncognito).toBe(true);
    });

    it(`should assign 'time'`, async () => {
      const event = createEvent();
      await fn(event);
      expect(event.time).toBeDefined();
    });

    it(`shouldn't override 'time' if it defined`, async () => {
      const event = createEvent();
      event.time = new Date(2020, 0, 1, 1, 1, 1);
      await fn(event);
      expect(event.time.getTime()).toBe(
        new Date(2020, 0, 1, 1, 1, 1).getTime()
      );
    });

    it(`should assign 'timezone'`, async () => {
      const event = createEvent();
      await fn(event);
      expect(event.timezone).toBe(DataHelper.getTimeZone());
    });

    it(`shouldn't override 'timezone' if it defined`, async () => {
      const event = createEvent();
      event.timezone = 4;
      await fn(event);
      expect(event.timezone).toBe(4);
    });

    it(`should assign 'href'`, async () => {
      const event = createEvent();
      await fn(event);
      expect(event.href).toBe(DataHelper.getHref());
    });

    it(`shouldn't override 'timezone' if it defined`, async () => {
      const event = createEvent();
      event.href = '/foo';
      await fn(event);
      expect(event.href).toBe('/foo');
    });

    it(`should assign 'utm*' only if all of UTM params are not defined`, async () => {
      const event = createEvent();
      event.utmCampaign = 'foo';
      await fn(event);
      expect(event.utmCampaign).toBe('foo');
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

    it(`should pass a X-SessionID`, async () => {
      const service = new Service();
      const event: Event = { name: 'bar' };

      // @ts-ignore
      await service.assignDefaults(event);

      const headers = await invoke(service, event);

      expect(headers).toEqual({
        [`Content-Type`]: 'application/json',
        [`Accept`]: 'application/json',
        [`User-Agent`]: DataHelper.getUserAgent(),
        [`X-SessionID`]: mockCookieValues[CookieKey.SESSION_ID],
      });
    });

    it(`should pass a X-API-KEY`, async () => {
      const service = new Service({ id: 'foo' });
      const event: Event = { name: 'bar' };

      // @ts-ignore
      await service.assignDefaults(event);

      const headers = await invoke(service, event);

      expect(headers).toEqual({
        [`Content-Type`]: 'application/json',
        [`Accept`]: 'application/json',
        [`User-Agent`]: DataHelper.getUserAgent(),
        [`X-API-KEY`]: 'foo',
        [`X-SessionID`]: mockCookieValues[CookieKey.SESSION_ID],
      });
    });

    it(`should pass a X-UserID`, async () => {
      const service = new Service();
      const event: Event = { name: 'bar', userId: 'foo' };

      // @ts-ignore
      await service.assignDefaults(event);

      const headers = await invoke(service, event);

      expect(headers).toEqual({
        [`Content-Type`]: 'application/json',
        [`Accept`]: 'application/json',
        [`User-Agent`]: DataHelper.getUserAgent(),
        [`X-UserID`]: 'foo',
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
      const beforeAssignDefaults = jest.fn(() => {});
      const beforeSend = jest.fn(() => {});

      const service = new Service({
        beforeAssignDefaults,
        beforeSend,
        url: 'foo',
        id: 'bar',
        verbose: true,
      });

      await service.send('foo');

      expect(beforeAssignDefaults).toBeCalled();
      expect(console.debug).toBeCalled();
      expect(beforeSend).toBeCalled();
      expect(fetch).toBeCalled();
    });
  });
});
