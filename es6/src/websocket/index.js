const { Stomp, Sparkline } = require('../../lib');

const { DEBUG, URL, WURL } = require('../core/constants/');

const client = Stomp.client(URL);

client.debug = (msg) => {
  if (DEBUG) console.info(msg); // eslint-disable-line no-console
};

function onMessage(message) {
  console.log(message);
}

function onConnectSuccess() {
  document.getElementById('stomp-status').innerHTML = 'It has now successfully connected to a stomp server serving price updates for some foreign exchange currency pairs.';
  client.subscribe(WURL, onMessage);
}

function onConnectError(error) {
  alert(error.headers.message);
}

// connects with the client
client.connect({}, onConnectSuccess, onConnectError);

const exampleSparkline = document.getElementById('example-sparkline');
Sparkline.draw(exampleSparkline, [1, 2, 3, 6, 8, 20, 2, 2, 4, 2, 3]);
