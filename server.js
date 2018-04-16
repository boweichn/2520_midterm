const express = require('express');
const request = require('request');
const hbs = require('hbs')
const geocode = require('./WeatherCopy/gmaps');
const currentWeather = require('./WeatherCopy/weather');
const getPic = require('./WeatherCopy/picsAPI')
const fs = require('fs');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false});

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
	response.render('main.hbs', {})
});

app.post('/postResult', urlencodedParser, (request, response) => {
	var userPic = request.body.picture
	var userWeath = request.body.weather
	var picURL = ''
	var picURL2 = ''

	if ((userWeath == '') && (userPic == '')) {
		response.send('you must enter a value in the picture field or weather field!')
	}

	if (userWeath == ''){
			getPic.getPicture(userPic, (results) => {
				if (results === 'connection error') {		// when receives connection error flag
					response.send('Cannot connect to Pixabay!');
				} else if (results === 'find error') {		//when receives cannot find error flag
					response.send('Cannot find this Picture!');
				} else {
					picURL = results.picture;
					picURL2 = results.picture2;
					response.render('me.hbs', {
						title: 'picture',
						image: picURL,
						image2: picURL2
					})
				}
			});
	}

	else if (userPic == ''){
		var longitude = '',
			latitude = '';

		var weatherStatus = '',
			precipPerc = '',
			temperature = '';

		console.log(userWeath);	

		var weatherID = '';

		geocode.getAddress(userWeath, (results) => {
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

					if (weatherStatus == 'rain') {
						weatherID = '09'
					} else if (weatherStatus == 'partly-cloudy-day') {
						weatherID = '04'
					} else if (weatherStatus == 'clear') {
						weatherID = '01'
					} else if (weatherStatus == 'snow') {
						weatherID = '13'
					}
				}
			})
		}, 700);
		setTimeout(() => {	
			var iconURL = `http://openweathermap.org/img/w/${weatherID}d.png`;
			response.render('weather.hbs', {
				weather: weatherStatus,
				precip: precipPerc,
				temp: temperature,
				location: userWeath,
				image: iconURL
			})
		}, 2000);
	}

	else{
		response.send('you must only enter one field or the other!');
	}
});

app.listen(port, () => {
    console.log('Server is up on the port 8080');
    // here add the logic to return the weather based on the statically provided location and save it inside the weather variable
});