var czml = require("../lib/czml");

const fs = require('fs');
var request = require('sync-request');
var request2 = require('request');
var unzip = require('unzip');

var cesiumDemo = 0;
process.argv.forEach(function (val, index, array) {
  if(val == "--cesiumDemo")
  	cesiumDemo = 1;
});

var orbits = [];

var orbit1 = new czml.orbit.fromParams({
    apogee: 426.9, // km
    perigee: 416.2, // km
    inclination: 51.65, // deg
    rightAscension: 304.1, // deg
    argumentOfPeriapsis: 117.8 // deg 
});
orbits.push(orbit1);

var tle = 'ISS (ZARYA)\n' +
    '1 25544U 98067A   08264.51782528 -.00002182  00000-0 -11606-4 0  2927\n' +
    '2 25544  51.6416 247.4627 0006703 130.5360 325.0288 15.72125391563537';
var orbit2 = new czml.orbit.fromTle(tle);
orbit2.setEpoch(czml.constants.now); //override TLE epoch
orbits.push(orbit2);

var tle = 'NOAA 14\n' +
    '1 23455U 94089A   97320.90946019  .00000140  00000-0  10191-3 0  2621\n' +
    '2 23455  99.0090 272.6745 0008546 223.1686 136.8816 14.11711747148495';
var orbit3 = new czml.orbit.fromTle(tle);
orbit3.setEpoch(czml.constants.now); //override TLE epoch
orbits.push(orbit3);

console.log(orbit3.getSettings());
console.log(orbit3.orbit);

//for loop save to samples
for (var i = 0; i < orbits.length; i++) {
    fs.writeFile(__dirname + "/samples/sample"+i+".czml", JSON.stringify(orbits[i].czml()), function(err) {
        if (err) {
            return console.log(err);
            process.exit();
        }
        console.log("The czml was saved to samples!");
    });
}

//check for latest Cesium version
var tag = 0;
var url = 0;

var res = request('GET', 'https://api.github.com/repos/AnalyticalGraphicsInc/cesium/releases/latest', {
    headers: {
        'User-Agent': 'request'
    },
});

var body = JSON.parse(res.getBody('utf8'));
tag = body.tag_name;
url = body.assets[0].browser_download_url;


//check if Cesium is downloaded and has a folder
if (tag && url && cesiumDemo) {

    if (!fs.existsSync(__dirname + "/Cesium-" + tag)) {
        //download Cesium
        request2(url)
            .pipe(fs.createWriteStream(__dirname + "/Cesium-" + tag + ".zip"))
            .on('close', function(x) {
                console.log('File written!');
                console.log("Please unzip \n" + __dirname + "/Cesium-" + tag + ".zip \nto\n" + __dirname + "/Cesium-" + tag + "\nand then re-run this test to see the full Cesium demo.");
            	console.log("Run the following commands inside of the Cesium directory:\nnpm install\nnode server.js\nopen localhost:8080/Apps/Sandcastle/index.html?src=CZML.html")
            });

    } else {
    	//Cesium is installed	
    	console.log("Add the following lines after: Sandcastle.addDefaultToolbarButton('Satellites', function() {\n\n")	
    	for (var i = 0; i < orbits.length; i++)
    		console.log("viewer.dataSources.add(Cesium.CzmlDataSource.load('../../SampleData/sample"+i+".czml'));");			    
		for (var i = 0; i < orbits.length; i++) {
			fs.writeFile(__dirname + "/Cesium-" + tag + "/Apps/SampleData/sample"+i+".czml", JSON.stringify(orbits[i].czml()), function(err) {
			    if (err) {
			        return console.log(err);
			    }
			    console.log("Saved to Cesium SampleData");

			});
		}
    }
}