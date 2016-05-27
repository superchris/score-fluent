// Import dependencies
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

// Custom imports
var User = require('./models/user');

// Read environment vars
if (process.env.NODE_ENV != 'production') require('dotenv').config();
var port = process.env.PORT || 9000;

var app = express();

// Constants
// time in this format: https://github.com/rauchg/ms.js
app.set('jwtSecret', process.env.JWT_SECRET);
app.set('jwtDuration', '7 days');

// connect to mongodb
mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/score-fluent');

// Parse json and url-encodec middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Log requests middleware
app.use(morgan('dev'));

// Serve client
app.use('/', express.static('./dist/client'));

// Serve api routes
require('./routes')(app);

app.listen(port);
console.log(`listening on ${port}\n`);