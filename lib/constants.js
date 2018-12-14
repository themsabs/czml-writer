var constants = {};

module.exports = constants;

constants.now = Math.round((new Date()).getTime() / 1000);

constants.earth = {};
constants.earth.G = (6.674)*Math.pow(10,-11); // gravitational constant
constants.earth.M = (5.972)*Math.pow(10,24);  // mass