var http = require('http');
var https = require('https');

function get(zip) {
  var request = http.get("http://maps.googleapis.com/maps/api/geocode/json?components=postal_code:" + zip, function(response) {
    var body = "";
    response.on("data", function(chunk) {
      body += chunk;
    })
    response.on("end", function () {
      if (response.statusCode === 200) {
        try {
          var result = JSON.parse(body);
          var address = result.results[0].formatted_address;
          var lat = result.results[0].geometry.bounds.northeast.lat;
          var lng = result.results[0].geometry.bounds.northeast.lng;
          getDarkSkyAPI(address, lat, lng);
        } catch (error) {
          // Parse Error
          printError(error)
        }
      } else {
        // Status Code Error
        printError({message: "There was an error getting location data for " + zip + ". (" + http.STATUS_CODES[response.statusCode] + ")"});
      }
    })
  });
  // Connection Error (Google API)
  request.on("error", printError);
}

function getDarkSkyAPI (address, lat, lng) {
  var request = https.get("https://api.forecast.io/forecast/<-- your API key ;D -->/" + lat + "," + lng, function(response) {
    var body = "";
    response.on("data", function(chunk) {
      body += chunk;
    })
    response.on("end", function() {
      if (response.statusCode === 200) {
        try {
          var forecast = JSON.parse(body);
          var temperature = forecast.currently.temperature;
          printForecast(address, temperature);
        } catch (error) {
          // Parse Error
          printError(error)
        }
      } else {
        // Status Code Error
        printError({message: "There was an error getting the weather at " + address + ". (" + http.STATUS_CODES[response.statusCode] + ")"});
      }
    })
  });
  // Connection Error (Forecast Dark Sky API)
  request.on("error", printError);
}

function printForecast (address, temperature) {
  console.log("The temperature in " + address + " is currently: " + temperature + " degrees F");
}

function printError(error) {
  console.log(error.message);
}

module.exports.get = get;