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
    const row = {};
    row.resources = [{ data, timeStamp }];

    const midPriceArray = this.constructor.filterMidPrices(row.resources, true);

    row.nameRow = this.table.appendCell(tableRow, data.name);
    row.bestBidRow = this.table.appendCell(tableRow, data.bestBid);
    row.bestAskRow = this.table.appendCell(tableRow, data.bestAsk);
    row.lastChangeAskRow = this.table.appendCell(tableRow, data.lastChangeAsk);
    row.lastChangeBidRow = this.table.appendCell(tableRow, data.lastChangeBid);
    row.sparklineRow = new Sparkline(this.table.appendCell(tableRow), midPriceArray);

    return row;
  }

  /* eslint-disable no-param-reassign */
  updateRow(row, data, timeStamp) {
    row.resources.push({ data, timeStamp });

    const midPriceArray = this.constructor.filterMidPrices(row.resources);

    row.nameRow.textContent = data.name;
    row.bestBidRow.textContent = data.bestBid;
    row.bestAskRow.textContent = data.bestAsk;
    row.lastChangeAskRow.textContent = data.lastChangeAsk;
    row.lastChangeBidRow.textContent = data.lastChangeBid;
    row.sparklineRow.draw(midPriceArray);

    return row;
  }
  /* eslint-enable */

  // Create table, headers and renders it.
  renderTable() {
    this.table.appendHeader([
      'Name',
      'Current Best Bid Price',
      'Current Best Ask Price',
      'Amount Best Bid Last Changed',
      'Amount Best Ask Last Changed',
      'Sparkline',
    ]);

    this.table.render(document.getElementById('table-container'));
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
