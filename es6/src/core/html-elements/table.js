/*
 * Interface for Table's creation
*/
class Table {
  constructor() {
    this.table = document.createElement('table');
  }

  appendHeader(value) {
    const header = document.createElement('th');
    const textNode = document.createTextNode(value);

    header.appendChild(textNode);
    this.table.appendChild(header);

    return this;
  }

  appendRow() {
    const tr = document.createElement('tr');
    this.table.appendChild(tr);

    return tr;
  }

  appendCell(tr, value) { // eslint-disable-line class-methods-use-this
    const textNode = document.createTextNode(value);

    const td = tr.insertCell(tr.childElementCount);
    td.appendChild(textNode);

    return td;
  }

  render(element) {
    element.appendChild(this.table);
  }
}

module.exports = Table;
