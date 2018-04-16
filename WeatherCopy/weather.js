const request = require('request');

var secretKey = '26654a8fd97b3e2d30b846babb7eeeb8';

var getWeather = (longitude, latitude, callback) => {
	request({
		url: `https://api.darksky.net/forecast/${secretKey}/${latitude},${longitude}`,
		json: true
	}, (error, response, body)=>{
		if (error) {
			callback('connect error');
		} else if (body.code == 400) {
			callback('find error');
		} else {
			var report = {
				weather: body.currently.icon,
				precipitation: body.currently.precipProbability*100+'%',
				temperature: parseInt((body.currently.temperature-32)*1.8)			//convert F to C
			}
			callback(report);			//callback report object with weather precip and temp info
		};
	});
};

module.exports = {
	getWeather
};


