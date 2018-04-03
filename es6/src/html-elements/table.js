/*
 * Interface for Table's creation
*/
class Table {
  constructor() {
    this.state = { headers: [], rows: [] };

    this.table = document.createElement('table');
    const tHead = document.createElement('thead');
    const tBody = document.createElement('tbody');

    this.table.appendChild(tHead);
    this.table.appendChild(tBody);
  }

  get headerKeys() {
    return this.state.headers.map(header => header.key);
  }

  getSignificantValues(values) {
    return this.headerKeys.reduce((prev, cur) => Object.assign(prev, { [cur]: values[cur] }), {});
  }

  // Append Header / Headers
  appendHeader(header) {
    if (header instanceof Array) {
      header.forEach(h => this.appendHeader(h));
    } else {
      this.state.headers.push(header);

      const th = document.createElement('th');
      const textNode = document.createTextNode(header.value);

      th.appendChild(textNode);
      this.table.getElementsByTagName('thead')[0].appendChild(th);
    }
  }

  appendRow(rowId, values) {
    const tr = document.createElement('tr');
    this.table.getElementsByTagName('tbody')[0].appendChild(tr);

    const significantValues = this.getSignificantValues(values);
    this.state.rows.push({ id: rowId, tr, values: significantValues });
    Object.keys(significantValues)
      .forEach(key => this.appendCell(rowId, tr, key, significantValues[key]));
  }

  updateRow(rowId, values) {
    const currentRow = this.state.rows.find(row => row.id === rowId);

    const significantValues = this.getSignificantValues(values);
    currentRow.values = significantValues;
    Object.keys(significantValues)
      .forEach(key => this.updateCell(rowId, currentRow.tr, key, significantValues[key]));
  }

  appendCell(rowId, tr, key, value) {
    const index = this.headerKeys.indexOf(key);
    const td = tr.insertCell(index);

    const currentHeader = this.state.headers.find(h => h.key === key);
    if (currentHeader.formatter) {
      const formattedValue = currentHeader.formatter(rowId, td, value);
      if (formattedValue) {
        const textNode = document.createTextNode(formattedValue);
        td.appendChild(textNode);
      }
    } else {
      const textNode = document.createTextNode(value);
      td.appendChild(textNode);
    }
  }

  updateCell(rowId, tr, key, value) {
    const index = this.headerKeys.indexOf(key);
    const td = tr.children[index];

    const currentHeader = this.state.headers.find(h => h.key === key);
    if (currentHeader.formatter) {
      const formattedValue = currentHeader.formatter(rowId, td, value);
      if (formattedValue) {
        const textNode = document.createTextNode(formattedValue);
        td.replaceChild(textNode, td.childNodes[0]);
      }
    } else {
      const textNode = document.createTextNode(value);
      td.replaceChild(textNode, td.childNodes[0]);
    }
  }

  sort({ type }) {
    const column = this.state.headers.find(header => header.sort);

    let sortedRows = this.state.rows.sort((rowA, rowB) => {
      const cellAValue = rowA.values[column.key];
      const cellBValue = rowB.values[column.key];

      if (cellAValue > cellBValue) { return 1; }
      if (cellAValue < cellBValue) { return -1; }
      return 0;
    });

    sortedRows = type === 'ASC' ? sortedRows.reverse() : sortedRows;
    sortedRows.forEach(row =>
      this.table.insertBefore(row.tr, this.table.getElementsByTagName('tbody')[0]));
  }

  render(element) {
    element.appendChild(this.table);
  }
}

module.exports = Table;
