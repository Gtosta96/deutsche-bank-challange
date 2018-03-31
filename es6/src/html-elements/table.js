/*
 * Interface for Table's creation
*/
class Table {
  constructor() {
    this.table = document.createElement('table');
    const tBody = document.createElement('tbody');
    const tHead = document.createElement('thead');

    this.table.appendChild(tHead);
    this.table.appendChild(tBody);
  }

  static getCellValue(row, index) {
    return row.getElementsByTagName('td').length ? row.getElementsByTagName('td')[index].textContent : '';
  }

  appendHeader(value) {
    const th = document.createElement('th');
    const textNode = document.createTextNode(value);

    th.appendChild(textNode);
    this.table.getElementsByTagName('thead')[0].appendChild(th);

    return this;
  }

  appendRow() {
    const tr = document.createElement('tr');
    this.table.getElementsByTagName('tbody')[0].appendChild(tr);

    return tr;
  }

  appendCell(tr, value) { // eslint-disable-line class-methods-use-this
    const textNode = document.createTextNode(value);

    const td = tr.insertCell(tr.childElementCount);
    td.appendChild(textNode);

    return td;
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
