const constants = {
  DEBUG: true, // Change this to get detailed logging from the stomp library
  WS: {
    URL: 'ws://localhost:8011/stomp',
    DESTINATION: '/fx/prices',
  },
  SPARKLINE: {
    TIME: 30,
  },
};

module.exports = constants;
