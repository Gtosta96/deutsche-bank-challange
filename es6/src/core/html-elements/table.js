function createTable() {
  const table = document.createElement('table');
  const tHeader = document.createElement('theader');
  const tBody = document.createElement('tbody');

  table.appendChild(tHeader);
  table.appendChild(tBody);

  return table;
}

function appendHeader(table) {
  const header = document.createElement('th');

  const tHeader = table.getElementsByTagName('theader')[0];
  tHeader.appendChild(header);
}

function appendRow(table) {
  const header = document.createElement('tr');

  const tHeader = table.getElementsByTagName('tbody')[0];
  tHeader.appendChild(header);
}
