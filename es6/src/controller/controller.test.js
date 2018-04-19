const Controller = require('./controller');

describe('controller.test.js', () => {
  let controller = null;
  let mockData = null;

  beforeEach(() => {
    document.body.innerHTML = '<div id="table"></div>';
    controller = new Controller();
    controller.sparklineFormatter = jest.fn(() => {});
    controller.table.appendRow = jest.fn(() => {});
    controller.table.updateRow = jest.fn(() => {});

    controller.renderTable(document.getElementById('table'));

    mockData = {
      name: 'euraud',
      bestBid: 1.5101654875214152,
      bestAsk: 1.5414337937846503,
      openBid: 1.4480389244892302,
      openAsk: 1.5187610755107699,
      lastChangeAsk: 0.062361982436689445,
      lastChangeBid: 0.09059568082903668,
    };
  });

  it('should create an instance', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new row', () => {
    const rowId = 'testId';
    controller.handleData(rowId, mockData);

    const currentRow = controller.state.rows.find(row => row.id === rowId);
    expect(currentRow).toBeDefined();
    expect(controller.table.appendRow).toHaveBeenCalledTimes(1);
  });

  it('should update an existing row', () => {
    const rowId = 'testId';
    controller.handleData(rowId, mockData);

    const changedMockData = Object.assign({}, mockData, { name: 'test' });
    controller.handleData(rowId, changedMockData);

    const currentRow = controller.state.rows.find(row => row.id === rowId);
    expect(currentRow.resources[1].data.name).toBe('test');
    expect(controller.table.updateRow).toHaveBeenCalledTimes(1);
  });

  it('should filter mid prices', () => {
    const tenSecondsBehind = new Date().setSeconds(new Date().getSeconds() - 10);
    const now = new Date().getTime();
    const mockResources = [
      { timeStamp: tenSecondsBehind, data: { bestBid: 10, bestAsk: 2 } },
      { timeStamp: now, data: { bestBid: 20, bestAsk: 5 } },
    ];

    const midPrices = Controller.filterMidPrices(mockResources);
    expect(midPrices).toEqual([6, 12.5]);
  });

  it('should ignore older mid prices', () => {
    const fortySecondsBehind = new Date().setSeconds(new Date().getSeconds() - 40);
    const now = new Date().getTime();
    const mockResources = [
      { timeStamp: fortySecondsBehind, data: { bestBid: 10, bestAsk: 2 } },
      { timeStamp: now, data: { bestBid: 20, bestAsk: 5 } },
    ];

    const midPrices = Controller.filterMidPrices(mockResources, 30);
    expect(midPrices).toEqual([12.5]);
  });
});
