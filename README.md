# Basic usage

From keplerian elements:
```
var orbit = new czml.orbit.fromParams({
    apogee: 426.9, // km
    perigee: 416.2, // km
    inclination: 51.65, // deg
    rightAscension: 304.1, // deg
    argumentOfPeriapsis: 117.8 // deg 
});
var output = orbit.czml();
```

From two-line elements
```
var tle = 'NOAA 14\n' +
    '1 23455U 94089A   97320.90946019  .00000140  00000-0  10191-3 0  2621\n' +
    '2 23455  99.0090 272.6745 0008546 223.1686 136.8816 14.11711747148495';
var orbit = new czml.orbit.fromTle(tle);
var output = orbit.czml();
```

To expose and use [kepler.js](https://github.com/jordanstephens/kepler.js) orbit object
```
var kepler = orbit.orbit;

//angularMomentum
var angularMomentum = kepler.angularMomentum();

//radialVelocity
var radialVelocity = kepler.radialVelocity();

//eccentricity
var eccentricity = kepler.eccentricity();

//semimajorAxis
var semimajorAxis = kepler.semimajorAxis();

//semiminorAxis
var semiminorAxis = kepler.semiminorAxis();

//semilatusRectum
var semilatusRectum = kepler.semilatusRectum();

//inclination
var inclination = kepler.inclination();

//nodeLine
var nodeLine = kepler.nodeLine();

//rightAscension
var rightAscension = kepler.rightAscension();

//argumentOfPeriapsis
var argumentOfPeriapsis = kepler.argumentOfPeriapsis();

//trueAnomaly
var trueAnomaly = kepler.trueAnomaly();

//apoapsis
var apoapsis = kepler.apoapsis();

//periapsis
var periapsis = kepler.periapsis();

//period
var period = kepler.period();
```

# Test Script

Basic tests:
`node test/test.js`

Test script with some help to get started with Cesium
`node test/test.js --cesiumDemo`
