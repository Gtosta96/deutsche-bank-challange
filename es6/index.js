const { Stomp } = require('./lib');
const { renderTable, handleData } = require('./src/controller');

const { DEBUG, WS } = require('./src/core/constants');

const client = Stomp.client(WS.URL);

client.debug = (msg) => {
  if (DEBUG) console.info(msg); // eslint-disable-line no-console
};

function onMessage(message) {
  handleData(JSON.parse(message.body));
}

function onConnectSuccess() {
  renderTable();
  client.subscribe(WS.DESTINATION, onMessage);
}

function onConnectError(error) {
  alert(error.headers.message); // eslint-disable-line no-alert
}

// connects with the client
client.connect({}, onConnectSuccess, onConnectError);
