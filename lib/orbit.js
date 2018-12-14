var Kepler = require('kepler.js');
var TLE = require('tle')

var writer = require("./writer");
var math = require("./math");

module.exports = orbit;

function orbit(x) {
	this.orbit = x;
	this.settings = {
		duration: 60*60*48, // 2 days in seconds
		step: 60,			// 60 seconds
		name: "Satellite",
		epoch: Math.round((new Date()).getTime() / 1000)  
	}
}

orbit.fromParams = function fromParams(params) {
	var x = new Kepler.Orbit.fromParams(params);
	return new orbit(x);
}

orbit.fromTle = function fromTle(tle) {
	var tle_ = TLE.parse(tle);
	var x = new Kepler.Orbit.fromParams({
	  semimajorAxis: math.semiMajorAxis(tle_.motion), // km
	  eccentricity: tle_.eccentricity, 
	  inclination: tle_.inclination, // deg 
	  rightAscension: tle_.ascension, // deg
	  argumentOfPeriapsis: tle_.perigee // deg 
	});
	var y = new orbit(x);
	y.setName(tle_.name);
	y.setEpoch(tle_.date.getTime()/1000);
	return y;
}

//getter
orbit.prototype.getSettings = function getSettings() {
	return this.settings;
}

orbit.prototype.update = function propagate(time) {
	this.orbit = this.orbit.update(time);
	this.settings.epoch += time;
}

orbit.prototype.czml = function czml() {
	return writer.write(this.orbit, this.settings);
}

orbit.prototype.setDuration = function setDuration(x) {
	this.settings.duration = x;
}

orbit.prototype.setStep = function setStep(x) {
	this.settings.step = x;
}

orbit.prototype.setName = function setName(x) {
	this.settings.name = x;
}

orbit.prototype.setEpoch = function setEpoch(x) {
	this.settings.epoch = x;
}