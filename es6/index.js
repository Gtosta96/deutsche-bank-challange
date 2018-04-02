const { Stomp } = require('./lib');
const Controller = require('./src/controller/controller');

const { DEBUG, WS } = require('./src/constants');

const controller = new Controller();
const client = Stomp.client(WS.URL);

client.debug = (msg) => {
  if (DEBUG) console.info(msg); // eslint-disable-line no-console
};

function onMessage(message) {
  const data = JSON.parse(message.body);
  controller.handleData(data.name, data); // defines id and value
}

function onConnectSuccess() {
  controller.renderTable();
  client.subscribe(WS.DESTINATION, onMessage);
}

function onConnectError(error) {
  alert(error.headers.message); // eslint-disable-line no-alert
}

// connects with the client
client.connect({}, onConnectSuccess, onConnectError);
