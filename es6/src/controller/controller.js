const Table = require('../html-elements/table');
const { Sparkline } = require('../../lib');
const { createTimeStamp, diffSecondsFromNow } = require('../utils/utils');

const { SPARKLINE } = require('../constants');

class Controller {
  constructor() {
    this.state = { rows: [] };
    this.table = new Table();

    this.sparklineFormatter = this.sparklineFormatter.bind(this);
  }

  // Filters the midPrice over the last ${SPARKLINE.TIME} seconds.
  static filterMidPrices(resources, time) {
    return resources.reduce((arr, cur) => {
      const expired = diffSecondsFromNow(cur.timeStamp) > time;
      if (!expired) {
        arr.push((cur.data.bestBid + cur.data.bestAsk) / 2);
      }

      return arr;
    }, []);
  }

  // formats Sparkline cell
  sparklineFormatter(rowId, el, value) {
    const currentRow = this.state.rows.find(row => row.id === rowId);
    if (!currentRow.sparklineRef) {
      currentRow.sparklineRef = new Sparkline(el);
    }

    currentRow.sparklineRef.draw(value);
  }

  // formats Name cell
  static nameFormatter(rowId, el, value) {
    return `${value.substring(0, 3)}-${value.substring(3)}`.toUpperCase();
  }

  // Creates new row
  createRow(id, data, timeStamp) {
    this.state.rows.push({ id, resources: [{ data, timeStamp }] });
    const currentRow = this.state.rows.find(row => row.id === id);

    const midPrice = this.constructor.filterMidPrices(currentRow.resources, SPARKLINE.TIME);
    const parsedData = Object.assign({}, data, { midPrice });

    this.table.appendRow(id, parsedData);
  }

  // Updates existent row
  updateRow(currentRow, data, timeStamp) {
    currentRow.resources.push({ data, timeStamp });

    const midPrice = this.constructor.filterMidPrices(currentRow.resources, SPARKLINE.TIME);
    const parsedData = Object.assign({}, data, { midPrice });

    this.table.updateRow(currentRow.id, parsedData);
  }

  // Create table, headers and renders it.
  renderTable(element) {
    // Play around... change columns order, move the sort attribute...
    // Important: to render a new column,
    // the key attribute must match the received key from /fx/prices data
    this.table.appendHeader([
      { key: 'name', value: 'Name', formatter: this.constructor.nameFormatter, columnClass: 'align-left' },
      // { key: 'openBid', value: 'Open Bid' },
      // { key: 'openAsk', value: 'Open Ask' },
      { key: 'bestBid', value: 'Current Best Bid Price' },
      { key: 'bestAsk', value: 'Current Best Ask Price' },
      { key: 'lastChangeBid', value: 'Amount Best Bid Last Changed', sort: true },
      { key: 'lastChangeAsk', value: 'Amount Best Ask Last Changed' },
      { key: 'midPrice', value: 'Sparkline', formatter: this.sparklineFormatter },
    ]);

    this.table.render(element);
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

    // Controls when table will be sorted (in this situation, every time a new data arrives)
    this.table.sort({ type: 'ASC' }); // available options: ASC || DESC
  }
}

module.exports = Controller;
