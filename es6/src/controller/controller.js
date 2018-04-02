const Table = require('../html-elements/table');
const Sparkline = require('../../lib/sparkline');
const { createTimeStamp, diffSecondsFromNow } = require('../utils/utils');

const { SPARKLINE } = require('../constants');

class Controller {
  constructor() {
    this.store = {
      rows: [],
    };
    this.table = new Table();
  }

  // Filters the midPrice over the last ${SPARKLINE.TIME} seconds.
  static filterMidPrices(resources, firstLoad) {
    return resources.reduce((arr, cur) => {
      const expired = diffSecondsFromNow(cur.timeStamp) > SPARKLINE.TIME;
      if (firstLoad || !expired) {
        arr.push((cur.data.bestBid + cur.data.bestAsk) / 2);
      }

      return arr;
    }, []);
  }

  // Creates new Row
  createRow(id, data, timeStamp) {
    const midPrice = this.constructor.filterMidPrices([{ data }], true);
    const parsedData = Object.assign({}, data, { midPrice, timeStamp });

    this.table.appendRow(id, parsedData);
    this.store.rows.push({ id, resources: [{ data, timeStamp }] });
  }

  /* eslint-disable no-param-reassign */
  updateRow(currentRow, data, timeStamp) {
    const midPrice = this.constructor.filterMidPrices(currentRow.resources);
    const parsedData = Object.assign({}, data, { midPrice });

    this.table.updateRow(currentRow.id, parsedData);
    currentRow.resources.push({ data, timeStamp });
  }
  /* eslint-enable */

  // Create table, headers and renders it.
  renderTable() {
    this.table.appendHeader([
      { key: 'name', value: 'Name' },
      { key: 'bestBid', value: 'Current Best Bid Price' },
      { key: 'bestAsk', value: 'Current Best Ask Price' },
      { key: 'lastChangeAsk', value: 'Amount Best Bid Last Changed' },
      { key: 'lastChangeBid', value: 'Amount Best Ask Last Changed' },
      { key: 'midPrice', value: 'Sparkline' },
    ]);

    this.table.render(document.getElementById('table-container'));
  }

  // Handles table's data
  handleData(id, data) {
    const timeStamp = createTimeStamp();
    const currentRow = this.store.rows.find(r => r.id === id);

    if (!currentRow) {
      this.createRow(id, data, timeStamp);
    } else {
      this.updateRow(currentRow, data, timeStamp);
    }

    this.table.sortTable({ type: 'ASC', columnIndex: 3 });
  }
}

module.exports = Controller;
