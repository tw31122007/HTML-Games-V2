'use strict';

const utils = {
  randomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },

  randomColor() {
    const minBrightness = 25;
    const minSaturation = 50;

    let color = 'hsl(';
    color += utils.randomIntBetween(0, 360) + ',';
    color += utils.randomIntBetween(minSaturation, 100) + '%,';
    color += utils.randomIntBetween(minBrightness, 100) + '%)';
    return color;
  },
};

if (typeof module !== 'undefined') {
  module.exports = utils;
}
