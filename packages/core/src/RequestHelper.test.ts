import RequestHelper from './RequestHelper';

const CLASS = `RequestHelper`;

describe(`${CLASS}`, () => {
  describe(`${CLASS}.createHeaders`, () => {
    it(`should return an object with a same props as in a passed values`, () => {
      const headers = RequestHelper.createHeaders({
        foo: 'foo',
        bar: 'bar',
      });

      expect(headers).toEqual({
        foo: 'foo',
        bar: 'bar',
      });
    });

    it(`should excludes a void values from a result collection`, () => {
      const headers = RequestHelper.createHeaders({
        bar: undefined,
        foo: null,
      });

      expect(headers).toEqual({});
    });

    it(`should transform a boolean values into numeric strings`, () => {
      const headers = RequestHelper.createHeaders({
        foo: true,
        bar: false,
      });

      expect(headers).toEqual({
        foo: '1',
        bar: '0',
      });
    });
  });

  describe(`${CLASS}.createBody`, () => {
    it(`should return a JSON string with a same props as in a passed values`, () => {
      const body = RequestHelper.createBody({
        foo: 'foo',
        bar: 'bar',
      });

      expect(body).toBe(
        JSON.stringify({
          foo: 'foo',
          bar: 'bar',
        })
      );
    });

    it(`should replace a void values to null in a result JSON string`, () => {
      const body = RequestHelper.createBody({
        foo: undefined,
        bar: null,
      });

      expect(body).toBe(
        JSON.stringify({
          foo: null,
          bar: null,
        })
      );
    });

    it(`should transform a boolean values into integer`, () => {
      const body = RequestHelper.createBody({
        foo: true,
        bar: false,
      });

      expect(body).toBe(
        JSON.stringify({
          foo: 1,
          bar: 0,
        })
      );
    });
  });

  describe(`${CLASS}.formatTime`, () => {
    it(`should return a string in a specified format`, () => {
      expect(RequestHelper.formatTime(new Date(2000, 1, 1, 0, 30, 41))).toBe(
        `2000-02-01 00:30:41`
      );
      expect(RequestHelper.formatTime(new Date(2000, 11, 31, 1, 30, 0))).toBe(
        `2000-12-31 01:30:00`
      );
    });
  });

  describe(`${CLASS}.formatTimezone`, () => {
    it(`should return a timezone offset in a specified format`, () => {
      expect(RequestHelper.formatTimezone(0)).toBe('GMT+0');
      expect(RequestHelper.formatTimezone(3)).toBe('GMT+3');
      expect(RequestHelper.formatTimezone(-3)).toBe('GMT-3');
    });
  });
});
