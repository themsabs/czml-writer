var Kepler = require('kepler.js');

var writer = {};

module.exports = writer;

writer.write = function write(orbit, settings) {
    start = settings.epoch;
    dur = settings.duration;
    var end = start + dur;
    interval = new Date(start*1000).toISOString() + "/" + new Date(end*1000).toISOString();
    startDate = new Date(start*1000).toISOString();

    var czml = [];
    czml[0] = {
        "id": "document",
        "name": "simple",
        "version": "1.0",
        "clock": {
            "interval": interval,
            "currentTime": startDate,
            "multiplier": 60,
            "range": "LOOP_STOP",
            "step": "SYSTEM_CLOCK_MULTIPLIER"
        }
    }
    czml[1] = instance(orbit, settings);
    return czml;
}

function instance(orbit, settings) {

    startEpoch = settings.epoch;
    duration = settings.duration;
    step = settings.step;
    name = settings.name;

    //use kepler.js to simulate the orbit
    propagation = cartesianPropagation(orbit, step, duration);

    //check if period is too small
    if (!propagation) {
        return 0;
    }

    //start epoch
    start = formatDate(startEpoch);

    //end epoch
    end = formatDate(startEpoch + duration);

    //generate path based on start/end/period
    path = generatePath(propagation.kepler.period(), startEpoch, startEpoch + duration);

    //check if period is too small
    if (!path) {
        return 0;
    }

    var czml = {
        "id": "Satellite/" + name,
        "name": name,
        "availability": start + "/" + end,
        "description": name,
        "billboard": {
            "eyeOffset": {
                "cartesian": [
                    0, 0, 0
                ]
            },
            "horizontalOrigin": "CENTER",
            "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADJSURBVDhPnZHRDcMgEEMZjVEYpaNklIzSEfLfD4qNnXAJSFWfhO7w2Zc0Tf9QG2rXrEzSUeZLOGm47WoH95x3Hl3jEgilvDgsOQUTqsNl68ezEwn1vae6lceSEEYvvWNT/Rxc4CXQNGadho1NXoJ+9iaqc2xi2xbt23PJCDIB6TQjOC6Bho/sDy3fBQT8PrVhibU7yBFcEPaRxOoeTwbwByCOYf9VGp1BYI1BA+EeHhmfzKbBoJEQwn1yzUZtyspIQUha85MpkNIXB7GizqDEECsAAAAASUVORK5CYII=",
            "pixelOffset": {
                "cartesian2": [
                    0, 0
                ]
            },
            "scale": 1.5,
            "show": true,
            "verticalOrigin": "CENTER"
        },
        "label": {
            "fillColor": {
                "rgba": [
                    255, 0, 255, 255
                ]
            },
            "font": "11pt Lucida Console",
            "horizontalOrigin": "LEFT",
            "outlineColor": {
                "rgba": [
                    0, 0, 0, 255
                ]
            },
            "outlineWidth": 2,
            "pixelOffset": {
                "cartesian2": [
                    12, 0
                ]
            },
            "show": true,
            "style": "FILL_AND_OUTLINE",
            "text": name,
            "verticalOrigin": "CENTER"
        },
        "path": {
            "show": [{
                "interval": start + "/" + end,
                "boolean": true
            }],
            "width": 1,
            "material": {
                "solidColor": {
                    "color": {
                        "rgba": [
                            255, 0, 255, 255
                        ]
                    }
                }
            },
            "resolution": 120,
            "leadTime": path.leadTime,
            "trailTime": path.trailTime

        },
        "position": {
            "interpolationAlgorithm": "LAGRANGE",
            "interpolationDegree": 5,
            "referenceFrame": "INERTIAL",
            "epoch": start,
            "cartesian": propagation.cartesian
        }
    };

    return czml;
}

function generatePath(period, start, end) {

    var leadTime = [];
    var trailTime = [];
    var curr = start;

    //if the period is less than 30 minutes, return error
    if (period < (60 * 30)) {
        return 0;
    } else {
        while (curr < end) {
            interval = formatDate(curr) + "/" + formatDate(curr + period);
            leadTime.push({ interval: interval, epoch: formatDate(curr), number: [0, period, period, 0] });
            trailTime.push({ interval: interval, epoch: formatDate(curr), number: [0, 0, period, period] });
            curr += period;
        }

        obj = {
            leadTime: leadTime,
            trailTime: trailTime
        }
        return obj;
    }

}

function cartesianPropagation(orbit, step, duration) {

    //if the period is less than 30 minutes, return error
    if (orbit.period() < (60 * 30)) {
        return 0;
    } else {

        data = JSON.parse(orbit.r.inspect());
        var cartesian = [0, data[0] * 1000, data[1] * 1000, data[2] * 1000];

        for (var i = 0; i <= duration; i += step) {

            orbit = orbit.update(step);
            data = JSON.parse(orbit.r.inspect());

            cartesian.push(i);
            cartesian.push(data[0] * 1000);
            cartesian.push(data[1] * 1000);
            cartesian.push(data[2] * 1000);
        }

        obj = {
            cartesian: cartesian,
            kepler: orbit
        }

        return obj;
    }
}

function formatDate(seconds) {
    return new Date(seconds * 1000).toISOString();
}

function lzero(str, len) {
    str += ''; // cast to string
    while (str.length < len) str = "0" + str;
    return str;
}