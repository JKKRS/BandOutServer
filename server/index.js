var express  = require('express');
var Path     = require('path');
var cors     = require('cors');
var jwt      = require('express-jwt');
var routes   = express.Router();
var morgan   = require('morgan');

if(process.env.NODE_ENV !== 'test') {

  var authenticate = jwt({
    secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
    audience: process.env.AUTH0_CLIENT_ID
  });

  // We're in development or production mode;
  // create and run a real server.
  var app = express();

  // Morgan for logging server requests
  app.use(morgan('dev'));

  // Parse incoming request bodies as JSON
  app.use(require('body-parser').json());

  // app.use(function(req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //   next();
  // });
  app.use(cors());

  require('./routes.js')(app, authenticate);

  // Start the server!
  var port = process.env.PORT || 5000;
  app.listen(port);
  console.log("Listening on port", port);
} else {
  // We're in test mode; make this file importable instead.
  routes.get('/api/tags-example', function(req, res) {
    res.send(['node', 'express', 'angular']);
  });

  module.exports = routes;
}
