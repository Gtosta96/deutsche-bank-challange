const { Stomp } = require('./lib');
const Controller = require('./src/controller');

const { DEBUG, WS } = require('./src/core/constants');

const controller = new Controller();
const client = Stomp.client(WS.URL);

client.debug = (msg) => {
  if (DEBUG) console.info(msg); // eslint-disable-line no-console
};

function onMessage(message) {
  controller.handleData(JSON.parse(message.body));
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
