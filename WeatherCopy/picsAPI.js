const request = require('request');

var picKey = '8709761-b5673facf44e99b4d4f934932';

var getPicture = (keyword, callback) => {
	request({
		url: `https://pixabay.com/api/?key=${picKey}&q=${keyword}`,
		json: true
	}, (error, response, body)=>{
		if (error) {
			callback('connect error');
		} else if (body.code == 400) {
			callback('find error');
		} else {
			var report = {
				picture: body.hits[0].largeImageURL,
				picture2: body.hits[1].largeImageURL
			}
			callback(report);			//callback report object with weather precip and temp info
		};
	});
};

module.exports = {
	getPicture
};


