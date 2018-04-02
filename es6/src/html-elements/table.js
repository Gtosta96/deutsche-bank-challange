/*
 * Interface for Table's creation
*/
class Table {
  constructor() {
    this.store = {
      headers: [],
      rows: [],
    };

    this.table = document.createElement('table');
    const tHead = document.createElement('thead');
    const tBody = document.createElement('tbody');

    this.table.appendChild(tHead);
    this.table.appendChild(tBody);
  }

  static getCellValue(row, index) {
    return row.getElementsByTagName('td').length ? row.getElementsByTagName('td')[index].textContent : undefined;
  }

  get headerKeys() {
    return this.store.headers.map(header => header.key);
  }

  appendHeader(header) {
    if (header instanceof Array) {
      header.forEach(h => this.appendHeader(h));
    } else {
      this.store.headers.push(header);

      const th = document.createElement('th');
      const textNode = document.createTextNode(header.value);

      th.appendChild(textNode);
      this.table.getElementsByTagName('thead')[0].appendChild(th);
    }
  }

  appendRow(id, values) {
    const tr = document.createElement('tr');
    this.table.getElementsByTagName('tbody')[0].appendChild(tr);

    this.store.rows.push({ id, tr, values });
    Object.keys(values).forEach(key => this.appendCell(tr, key, values[key]));
  }

  updateRow(rowId, values) {
    const rowObj = this.store.rows.find(row => row.id === rowId);
    Object.keys(rowObj.values).forEach(key => this.updateCell(rowObj.tr, key, values[key]));

    return rowId;
  }

  appendCell(tr, key, value) {
    const { headerKeys } = this;
    if (!headerKeys.includes(key)) return;

    const textNode = document.createTextNode(value);

    const td = tr.insertCell(headerKeys.indexOf(key));
    td.appendChild(textNode);
  }

  updateCell(tr, key, value) {
    const { headerKeys } = this;
    if (!headerKeys.includes(key)) return;

    const textNode = document.createTextNode(value);

    const td = tr.children[headerKeys.indexOf(key)];
    td.replaceChild(textNode, td.childNodes[0]);
  }

  getRows() {
    return this.table.getElementsByTagName('tr');
  }

  sortTable({ type, columnIndex }) {
    const rows = this.getRows();

    let sortedRows = Array.from(rows).sort((rowA, rowB) => {
      const cellAValue = this.constructor.getCellValue(rowA, columnIndex);
      const cellBValue = this.constructor.getCellValue(rowB, columnIndex);

      if (cellAValue > cellBValue) { return 1; }
      if (cellAValue < cellBValue) { return -1; }
      return 0;
    });

    sortedRows = type === 'ASC' ? sortedRows.reverse() : sortedRows;
    sortedRows.forEach(row =>
      this.table.insertBefore(row, this.table.getElementsByTagName('tbody')[0]));
  }

  render(element) {
    element.appendChild(this.table);
  }
}

module.exports = Table;
