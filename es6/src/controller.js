const Table = require('./core/html-elements/table');
const Sparkline = require('./core/sparkline');
const { createTimeStamp, diffSecondsFromNow } = require('./core/utils');

const { SPARKLINE } = require('./core/constants');

const store = {};
const table = new Table();

/* private functions */
function createRow(data, timeStamp) {
  const tableRow = table.appendRow();
  const midPrice = (data.bestBid + data.bestAsk) / 2;

  const row = {
    nameRow: table.appendCell(tableRow, data.name),
    bestBidRow: table.appendCell(tableRow, data.bestBid),
    bestAskRow: table.appendCell(tableRow, data.bestAsk),
    openBidRow: table.appendCell(tableRow, data.openBid),
    openAskRow: table.appendCell(tableRow, data.openAsk),

    midPriceRow: new Sparkline(table.appendCell(tableRow), midPrice),
    resources: [{ data, timeStamp }],
  };

  return row;
}

// Filters the midPrice over the last ${SPARKLINE.TIME} seconds.
function filterMidPrices(resources) {
  return resources.reduce((arr, cur) => {
    const expired = diffSecondsFromNow(cur.timeStamp) > SPARKLINE.TIME;
    if (!expired) {
      arr.push((cur.data.bestBid + cur.data.bestAsk) / 2);
    }

    return arr;
  }, []);
}

/* eslint-disable no-param-reassign */
function updateRow(row, data, timeStamp) {
  row.nameRow.innerText = data.name;
  row.bestBidRow.innerText = data.bestBid;
  row.bestAskRow.innerText = data.bestAsk;
  row.openBidRow.innerText = data.openBid;
  row.openAskRow.innerText = data.openAsk;

  const midPriceArray = filterMidPrices(row.resources);
  row.midPriceRow.draw(midPriceArray);

  row.resources.push({ data, timeStamp });

  return row;
}
/* eslint-enable */

/* public functions */
// Create table, headers and renders it.
function renderTable() {
  table
    .appendHeader('Name')
    .appendHeader('Current Best Bid Price')
    .appendHeader('Current Best Ask Price')
    .appendHeader('Amount Best Bid Last Changed')
    .appendHeader('Amount Best Ask Last Changed')
    .appendHeader('Sparkline')
    .render(document.getElementById('table-container'));
}

// Handles table's data
function handleData(data) {
  const row = store[data.name];
  const timeStamp = createTimeStamp();

  const obj = !row ? createRow(data) : updateRow(row, data, timeStamp);
  store[data.name] = obj;
}

const controller = {
  renderTable,
  handleData,
};

module.exports = controller;
