const Table = require('./core/html-elements/table');
const Sparkline = require('./core/sparkline');
const { createTimeStamp, diffSecondsFromNow } = require('./core/utils');

const { SPARKLINE } = require('./core/constants');

const store = {};
const table = new Table();

/* private functions */
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

// Creates new Row
function createRow(data, timeStamp) {
  const tableRow = table.appendRow();
  const midPrice = (data.bestBid + data.bestAsk) / 2;

  const row = {
    nameRow: table.appendCell(tableRow, data.name),
    bestBidRow: table.appendCell(tableRow, data.bestBid),
    bestAskRow: table.appendCell(tableRow, data.bestAsk),
    openBidRow: table.appendCell(tableRow, data.openBid),
    openAskRow: table.appendCell(tableRow, data.openAsk),
    lastChangeAskRow: table.appendCell(tableRow, data.lastChangeAsk),
    lastChangeBidRow: table.appendCell(tableRow, data.lastChangeBid),
    sparklineRow: new Sparkline(table.appendCell(tableRow), midPrice),

    resources: [{ data, timeStamp }],
  };

  return row;
}

/* eslint-disable no-param-reassign */
function updateRow(row, data, timeStamp) {
  const midPriceArray = filterMidPrices(row.resources);

  row.nameRow.innerText = data.name;
  row.bestBidRow.innerText = data.bestBid;
  row.bestAskRow.innerText = data.bestAsk;
  row.openBidRow.innerText = data.openBid;
  row.openAskRow.innerText = data.openAsk;
  row.lastChangeAskRow.innerText = data.lastChangeAsk;
  row.lastChangeBidRow.innerText = data.lastChangeBid;
  row.sparklineRow.draw(midPriceArray);

  row.resources.push({ data, timeStamp });

  return row;
}
/* eslint-enable */

/* public functions */
// Create table, headers and renders it.
function renderTable() {
  table
    .appendHeader('Currency Name')
    .appendHeader('Current Best Bid Price')
    .appendHeader('Current Best Ask Price')
    .appendHeader('Current Open Bid Price')
    .appendHeader('Current Open Ask Price')
    .appendHeader('Amount Best Bid Last Changed')
    .appendHeader('Amount Best Ask Last Changed')
    .appendHeader('Sparkline')
    .render(document.getElementById('table-container'));
}

// Handles table's data
function handleData(data) {
  const row = store[data.name];
  const timeStamp = createTimeStamp();

  const obj = !row ? createRow(data, timeStamp) : updateRow(row, data, timeStamp);
  store[data.name] = obj;

  table.sortTable({ type: 'ASC', columnIndex: 5 });
}

const controller = {
  renderTable,
  handleData,
};

module.exports = controller;
