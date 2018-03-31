const Table = require('../html-elements/table');
const Sparkline = require('../sparkline/sparkline');
const { createTimeStamp, diffSecondsFromNow } = require('../utils/utils');

const { SPARKLINE } = require('../constants');

class Controller {
  constructor() {
    this.store = {};
    this.table = new Table();
  }

  // Filters the midPrice over the last ${SPARKLINE.TIME} seconds.
  static filterMidPrices(resources) {
    return resources.reduce((arr, cur) => {
      const expired = diffSecondsFromNow(cur.timeStamp) > SPARKLINE.TIME;
      if (!expired) {
        arr.push((cur.data.bestBid + cur.data.bestAsk) / 2);
      }

      return arr;
    }, []);
  }

  // Creates new Row
  createRow(data, timeStamp) {
    const tableRow = this.table.appendRow();
    const midPrice = (data.bestBid + data.bestAsk) / 2;

    const row = {
      nameRow: this.table.appendCell(tableRow, data.name),
      bestBidRow: this.table.appendCell(tableRow, data.bestBid),
      bestAskRow: this.table.appendCell(tableRow, data.bestAsk),
      // openBidRow: this.table.appendCell(tableRow, data.openBid),
      // openAskRow: this.table.appendCell(tableRow, data.openAsk),
      lastChangeAskRow: this.table.appendCell(tableRow, data.lastChangeAsk),
      lastChangeBidRow: this.table.appendCell(tableRow, data.lastChangeBid),
      sparklineRow: new Sparkline(this.table.appendCell(tableRow), midPrice),

      resources: [{ data, timeStamp }],
    };

    return row;
  }

  /* eslint-disable no-param-reassign */
  updateRow(row, data, timeStamp) {
    const midPriceArray = this.constructor.filterMidPrices(row.resources);

    row.nameRow.textContent = data.name;
    row.bestBidRow.textContent = data.bestBid;
    row.bestAskRow.textContent = data.bestAsk;
    // row.openBidRow.textContent = data.openBid;
    // row.openAskRow.textContent = data.openAsk;
    row.lastChangeAskRow.textContent = data.lastChangeAsk;
    row.lastChangeBidRow.textContent = data.lastChangeBid;
    row.sparklineRow.draw(midPriceArray);

    row.resources.push({ data, timeStamp });

    return row;
  }
  /* eslint-enable */

  // Create table, headers and renders it.
  renderTable() {
    this.table
      .appendHeader('Currency Name')
      .appendHeader('Current Best Bid Price')
      .appendHeader('Current Best Ask Price')
      // .appendHeader('Current Open Bid Price')
      // .appendHeader('Current Open Ask Price')
      .appendHeader('Amount Best Bid Last Changed')
      .appendHeader('Amount Best Ask Last Changed')
      .appendHeader('Sparkline')
      .render(document.getElementById('table-container'));
  }

  // Handles table's data
  handleData(data) {
    const row = this.store[data.name];
    const timeStamp = createTimeStamp();

    const obj = !row ? this.createRow(data, timeStamp) : this.updateRow(row, data, timeStamp);
    this.store[data.name] = obj;

    this.table.sortTable({ type: 'ASC', columnIndex: 3 });
  }
}

module.exports = Controller;
