function createTimeStamp() {
  return new Date().getTime();
}

function diffSecondsFromNow(date) {
  return Math.abs((date - new Date().getTime()) / 1000);
}

const utils = {
  createTimeStamp,
  diffSecondsFromNow,
};

module.exports = utils;
