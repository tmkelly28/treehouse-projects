var forecast = require('./forecast');
var zip = process.argv.slice(2);
forecast.get(zip);