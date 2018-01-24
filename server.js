var express = require('express'),
app = express(),
port = process.env.PORT || 3000,
mongoose = require('mongoose'),
User = require('./api/models/userModel'), //created model loading here
Day = require('./api/models/dayModel'),
jsonwebtoken = require("jsonwebtoken"),
bodyParser = require('body-parser'),
cookieParser = require('cookie-parser'),
path = require('path');

// mongoose instance connection url connection
var promise = mongoose.connect('mongodb://localhost/timeclock', {
  useMongoClient: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use(function(req, res, next) {
	if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
		jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
			if(err) req.user = undefined;
			req.user = decode;
			next();
		});
	} else {
		req.user = undefined;
		next();
	}
});

var userRoutes = require('./api/routes/userRoutes'); //importing route
var dayRoutes = require('./api/routes/dayRoutes');
userRoutes(app);
dayRoutes(app); //register the route

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('Time Clock RESTful API server started on: ' + port);
