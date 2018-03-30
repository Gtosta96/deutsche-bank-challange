/*
* This is the library that provides websocket streaming pub/sub
* The dev serverver is serving the html and javascript,
* but it also provides updating fx data on /fx/prices.
 */

const libs = {
  Sparkline: require('./sparkline'),
  Stomp: require('./stomp').Stomp,
};

module.exports = libs;
