const Table = require('./table');

describe('Table.test.js', () => {
  let table = null;

  beforeEach(() => {
    document.body.innerHTML = '<div id="table"></div>';
    table = new Table();
    table.render(document.getElementById('table'));
  });

  it('should create an instance', () => {
    expect(table).toBeDefined();
  });

  it('should append header', () => {
    table.appendHeader('test');
    const header = document.getElementsByTagName('th')[0];

    expect(header.textContent).toBe('test');
  });

  it('should append rows', () => {
    table.appendRow();
    table.appendRow();

    const rows = table.getRows();
    expect(rows.length).toBe(2);
  });

  it('should append cell', () => {
    const rowA = table.appendRow();
    const rowB = table.appendRow();

    table.appendCell(rowA, '10');
    table.appendCell(rowB, '15');

    expect(Table.getCellValue(rowA, 0)).toBe('10');
    expect(Table.getCellValue(rowB, 0)).toBe('15');
  });

  it('should sort rows', () => {
    const rowA = table.appendRow();
    const rowB = table.appendRow();

    table.appendCell(rowA, '1');
    table.appendCell(rowA, '2');
    table.appendCell(rowA, '3');
    table.appendCell(rowB, '20');
    table.appendCell(rowB, '21');
    table.appendCell(rowB, '22');

    expect(Table.getCellValue(rowA, 0)).toBe('1');
    expect(Table.getCellValue(rowA, 1)).toBe('2');
    expect(Table.getCellValue(rowA, 2)).toBe('3');
    expect(Table.getCellValue(rowB, 0)).toBe('20');
    expect(Table.getCellValue(rowB, 1)).toBe('21');
    expect(Table.getCellValue(rowB, 2)).toBe('22');

    table.sortTable({ type: 'ASC', columnIndex: 0 });

    expect(Table.getCellValue(table.getRows()[0], 0)).toBe('20');
  });
});
