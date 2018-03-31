const utils = require('./utils');

describe('Utils.test.js', () => {
  it('should exist', () => {
    expect(utils).toBeDefined();
  });

  describe('CreateTimeStamp fn', () => {
    it('should exist', () => {
      expect(utils.createTimeStamp).toBeDefined();
    });

    it('should retrieve timeStamp', () => {
      const timeStamp = utils.createTimeStamp();
      expect(typeof timeStamp).toBe('number');
    });
  });

  describe('DiffSecondsFromNow fn', () => {
    it('should exist', () => {
      expect(utils.diffSecondsFromNow).toBeDefined();
    });

    it('should return', () => {
      const timeStamp = utils.createTimeStamp();

      const diff = utils.diffSecondsFromNow(timeStamp);
      expect(diff).toBeDefined();
    });

    it('should diff seconds 10 seconds', () => {
      const date = new Date();
      date.setSeconds(date.getSeconds() - 10);

      const diff = utils.diffSecondsFromNow(date.getTime());
      expect(diff).toBe(10);
    });
  });
});
