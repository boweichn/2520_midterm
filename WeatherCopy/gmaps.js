const request = require('request');

var getAddress = (address, callback) => {
	request({
		url: `http://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}`,
		json: true
	}, (error, response, body)=>{
		if (error) {
			callback('connection error');			//callback connection error flag
		} else if (body.status == 'ZERO_RESULTS') {
			callback('find error');					//callback cannot find error flag
		} else if (body.status == 'OK') {
			var longLat = {
				longitude: body.results[0].geometry.location.lng,
				latitude: body.results[0].geometry.location.lat
			}
			callback(longLat);						//callback longitude and latitude
		};
	});
};

module.exports = {
	getAddress
};

