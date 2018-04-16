const express = require('express');
const hbs = require('hbs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

hbs.registerHelper('message', (text) => {
	return text.toUpperCase()
})

hbs.registerHelper('image', (imagePath) => {
	return imagePath
})

app.get('/', (request, response) => {
	response.send({
		name: 'Your name',
		school: [
			'BCIT',
			'SFU',
			'UBC'
		]
	});
});

app.get('/info', (request, response) => {
	response.render('ch9.hbs', {
		title: 'About page',
		year: new Date().getFullYear(),
		welcome: 'Hello',
		image: 'images/bhole.jpg'
	});
});

app.get('/404', (request, response) => {
	response.send({
		error: 'Page not found'
	})
})

app.listen(8080, () => {
	console.log('Server is up on the port 8080');
});