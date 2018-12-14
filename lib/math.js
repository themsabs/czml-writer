var constants = require("./constants");

var math = {};

module.exports = math;

//references:
//http://orbitsimulator.com/gravity/articles/smaCalculator.html, 
//https://space.stackexchange.com/questions/18289/how-to-get-semi-major-axis-from-tle
math.semiMajorAxis = function semiMajorAxis(meanMotion) {
	var P = (60*60*24)/meanMotion; //period
	var G = constants.earth.G;
	var M = constants.earth.M;
	var pi = Math.PI;

	return Math.pow( (Math.pow(P,2)*G*M) / (4*Math.pow(pi,2)) , 1/3)/1000;
}