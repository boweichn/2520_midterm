const express = require('express');
const request = require('request');
const hbs = require('hbs')
const geocode = require('./WeatherCopy/gmaps');
const currentWeather = require('./WeatherCopy/weather');
const fs = require('fs');

var app = express();
var strMain = 'About Me Page'
var strWeath = 'Check Local Weather'
var strHome = 'Home'
var showMainLink = strMain.link('/public/me.html')
var showWeathlink = strWeath.link('/weather/vancouver')
var showHome = strHome.link('/')

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use('/public', express.static(__dirname + '/public'));

const port = process.env.PORT || 8080;

/* app.use((request, response, next) => {
	response.render('maint.hbs', {});
	var time = new Date().toString();
	var log = `${time}: ${request.method} ${request.url}`;
	fs.appendFile('server.log', log + '\n', (error) => {
		if (error) {
			console.log('Unable to log message');
		}
	});

}); */

hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

app.get('/', (request, response) => {
	var strMain = 'About Me Page'
	var strWeath = 'Check Local Weather'
	var showMainLink = strMain.link('/info')
	var showWeathlink = strWeath.link('/weather/vancouver')
	response.send(`${showMainLink}	${showWeathlink}`)
});

app.get('/info', (request, response) => {
	response.render('me.hbs', {
		firstLink: '/',
		fLinkDisp: 'HOME',
		secondLink: '/weather/vancouer',
		sLinkDisp: 'Weather',
		title: 'About Me',
		image: 'http://kb4images.com/images/picture/37509081-picture.jpg'
	})
})

app.get('/weather/:location', (request, response) => {
	var longitude = '',
		latitude = '';

	var weatherStatus = '',
		precipPerc = '',
		temperature = '';

	var locate = request.params.location

	geocode.getAddress(locate, (results) => {
		if (results === 'connection error') {		// when receives connection error flag
			response.send('Cannot connect to google maps!');
		} else if (results === 'find error') {		//when receives cannot find error flag
			response.send('Cannot find this location!');
		} else {
			longitude = results.longitude;			//returning and setting longitude variable
			latitude = results.latitude;				//returning and setting latitude variable
		}
	})

	setTimeout(() => {				//set timeout here incase for some reason this runs before getAddress
		currentWeather.getWeather(longitude, latitude, (results) => {
			if (results === 'connect error') {
				response.send('Cannot connect to weather database!');
			} else if (results === 'find error') {
				response.send('Cannot find weather with destination provided!');
			} else {
				weatherStatus = results.weather 
				precipPerc = results.precipitation 
				temperature = results.temperature
			}
		})
	}, 700);
	setTimeout(() => {	
		response.render('weather.hbs', {
			firstLink: '/',
			fLinkDisp: 'HOME',
			secondLink: '/info',
			sLinkDisp: 'About Me',
			title: 'Weather',
			weather: weatherStatus,
			precip: precipPerc,
			temp: temperature,
			location: locate
		})
	}, 2000);
})

app.listen(port, () => {
    console.log('Server is up on the port 8080');
    // here add the logic to return the weather based on the statically provided location and save it inside the weather variable
});