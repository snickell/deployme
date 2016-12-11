var getConfig = require('./server/config').get;
var haventSetAdminPassword = require('./server/config').haventSetAdminPassword;

var baseURL = getConfig("BASE_URL");

/**
* Module dependencies.
*/

var express = require('express');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');

var app = express();

console.log("env is: ", app.get('env'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set port for azure web app environment
app.set('port', process.env.PORT || 3000);

// NZ Database
var NZDB = require('./server/nzdb');
var db = new NZDB();


// Setup basic app routes
var router = express.Router();


app.get('/', function (req, res) {
  db.test().then(function (result) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 
      hello: "world",
      result: result
    }));    
  });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("node process.version=", process.version);
  console.log("Express server listening on port " + app.get('port'));
});