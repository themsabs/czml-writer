# Test Script

`node test/test.js`

# Basic usage

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

```
var tle = 'NOAA 14\n' +
    '1 23455U 94089A   97320.90946019  .00000140  00000-0  10191-3 0  2621\n' +
    '2 23455  99.0090 272.6745 0008546 223.1686 136.8816 14.11711747148495';
var orbit = new czml.orbit.fromTle(tle);
var output = orbit.czml();
```

Mention that calling orbit3.orbit will expose you to the Keplerian Object that you can use their entire library of functions on.

Talk about --cesiumDemo flag
