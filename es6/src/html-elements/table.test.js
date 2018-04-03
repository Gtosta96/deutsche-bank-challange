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
    table.appendHeader({ key: 'test', value: 'Test Header' });
    const header = document.getElementsByTagName('th')[0];

    expect(header.textContent).toBe('Test Header');
  });

  it('should append rows', () => {
    table.appendHeader({ key: 'test', value: 'Test Header' });
    table.appendRow('rowId', { test: 'Test Row' });

    const row = document.getElementsByTagName('tr')[0];
    expect(row.childElementCount).toBe(1);
    expect(row.textContent).toBe('Test Row');
  });

  it('should sort rows', () => {
    table.appendHeader([
      { key: 'test', value: 'Test Header 1', sort: true },
    ]);

    table.appendRow('rowId_1', { test: '10' });
    table.appendRow('rowId_2', { test: '20' });
    table.appendRow('rowId_3', { test: '30' });

    table.sort({ type: 'ASC' });

    const row = document.getElementsByTagName('tr');

    expect(row[0].getElementsByTagName('td')[0].textContent).toBe('30');
    expect(row[1].getElementsByTagName('td')[0].textContent).toBe('20');
    expect(row[2].getElementsByTagName('td')[0].textContent).toBe('10');
  });
});
