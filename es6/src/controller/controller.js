const Table = require('../html-elements/table');
const Sparkline = require('../../lib/sparkline');
const { createTimeStamp, diffSecondsFromNow } = require('../utils/utils');

const { SPARKLINE } = require('../constants');

class Controller {
  constructor() {
    this.state = { rows: [] };
    this.table = new Table();

    this.sparklineFormatter = this.sparklineFormatter.bind(this);
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

  // formats Sparkline row
  sparklineFormatter(rowId, el, value) {
    const currentRow = this.state.rows.find(row => row.id === rowId);
    if (!currentRow.sparklineRef) {
      currentRow.sparklineRef = new Sparkline(el);
    }

    currentRow.sparklineRef.draw(value);
  }

  // Creates new row
  createRow(id, data, timeStamp) {
    this.state.rows.push({ id, resources: [{ data, timeStamp }] });
    const currentRow = this.state.rows.find(row => row.id === id);

    const midPrice = this.constructor.filterMidPrices(currentRow.resources);
    const parsedData = Object.assign({}, data, { midPrice });

    this.table.appendRow(id, parsedData);
  }

  // Updates existent row
  updateRow(currentRow, data, timeStamp) {
    currentRow.resources.push({ data, timeStamp });

    const midPrice = this.constructor.filterMidPrices(currentRow.resources);
    const parsedData = Object.assign({}, data, { midPrice });

    this.table.updateRow(currentRow.id, parsedData);
  }

  // Create table, headers and renders it.
  renderTable() {
    this.table.appendHeader([
      { key: 'name', value: 'Name' },
      { key: 'bestBid', value: 'Current Best Bid Price' },
      { key: 'bestAsk', value: 'Current Best Ask Price' },
      { key: 'lastChangeBid', value: 'Best Bid Amount Last Changed', sort: true },
      { key: 'lastChangeAsk', value: 'Best Ask Amount Last Changed' },
      { key: 'midPrice', value: 'Sparkline', formatter: this.sparklineFormatter },
    ]);

    this.table.render(document.getElementById('table-container'));
  }

  // Handles table's data
  handleData(id, data) {
    const timeStamp = createTimeStamp();
    const currentRow = this.state.rows.find(row => row.id === id);

    if (!currentRow) {
      this.createRow(id, data, timeStamp);
    } else {
      this.updateRow(currentRow, data, timeStamp);
    }

    this.table.sort({ type: 'ASC' });
  }
}

module.exports = Controller;
