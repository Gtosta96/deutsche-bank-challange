const { Sparkline: SparklineImpl } = require('../../lib');

/*
* Sparkline Wrapper
*/
class Sparkline {
  constructor(element, v, opts) {
    const defaultOptions = { lineColor: '#666666', startColor: '#ffa500', endColor: '#0000ff', maxColor: '#ff0000', minColor: '#008000' };

    const values = v instanceof Array ? v : [v];
    const options = opts || defaultOptions;

    const sparkline = new SparklineImpl(element, options);
    if (values) sparkline.draw(values);

    return sparkline;
  }
}

module.exports = Sparkline;
