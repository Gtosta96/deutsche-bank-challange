function createTimeStamp() {
  return new Date().getTime();
}

function diffSecondsFromNow(date) {
  return Math.abs((date - new Date().getTime()) / 1000);
}

function get(data, key) {
  return key.split('.').reduce((prev, cur) => prev[cur] || prev, data);
}

function sort(data, property) {
  return data.sort((itemA, itemB) => {
    const valueA = get(itemA, property);
    const valueB = get(itemB, property);

    if (valueA > valueB) { return 1; }
    if (valueA < valueB) { return -1; }
    return 0;
  });
}

const utils = {
  createTimeStamp,
  diffSecondsFromNow,
  get,
  sort,
};

module.exports = utils;
