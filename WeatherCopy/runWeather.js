/*  Author: Bo Cheng
	Student Id: A01020329
*/

const request = require('request');
const yargs = require('yargs');

const geocode = require('./gmaps');
const currentWeather = require('./weather')

const argv = yargs
	.strict()
	.options({
		address: {
			demand: true,
			alias: 'a',
			describe: 'Search for an address',
			string: true
		}
	})
	.help()
	.argv;

console.log(argv)

var main = () =>{
	if (argv.address === '') {
		console.log('Missing address input after command, please try again!');	// in case user did not put a destination after --a=
		process.exit();
	};

	var longitude = '',
		latitude = ''

	geocode.getAddress(argv.address, (results) => {
		if (results === 'connection error') {		// when receives connection error flag
			console.log('Cannot connect to google maps!');
			process.exit();
		} else if (results === 'find error') {		//when receives cannot find error flag
			console.log('Cannot find this location!');
			process.exit();
		} else {
			longitude = results.longitude;			//returning and setting longitude variable
			latitude = results.latitude;				//returning and setting latitude variable
		}
	})

	setTimeout(() => {
		if (longitude === ''){
			console.log('Google server acting up! Please try again!'); // sometimes google server acts up, this is to account for it
			process.exit();
		}
	}, 500);

	setTimeout(() => {				//set timeout here incase for some reason this runs before getAddress
		currentWeather.getWeather(longitude, latitude, (results) => {
			if (results === 'connect error') {
				console.log('Cannot connect to weather database!');
				process.exit();
			} else if (results === 'find error') {
				console.log('Cannot find weather with destination provided!');
			} else {
				console.log(`The current weather at ${argv.address} is ${results.weather}\nThe probability for precipitation is ${results.precipitation}`);
				console.log(`The current temperature is at ${results.temperature} degrees celcius`);
			}
		})
	}, 700);
}

main()
