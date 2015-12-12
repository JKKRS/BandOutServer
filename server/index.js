var express  = require('express');
var Path     = require('path');
var cors     = require('cors');
var jwt      = require('express-jwt');
var routes   = express.Router();
var morgan   = require('morgan');

if(process.env.NODE_ENV !== 'test') {

  var auth0 =  {
    secret : process.env.AUTH0_CLIENT_SECRET || require('../.env').AUTH0_CLIENT_SECRET,
    key : process.env.AUTH0_CLIENT_ID || require('../.env').AUTH0_CLIENT_ID
  }

  var authenticate = jwt({
    secret: new Buffer(auth0.secret, 'base64'),
    audience: auth0.key
  });

  // We're in development or production mode;
  // create and run a real server.
  var app = express();

  // Morgan for logging server requests
  app.use(morgan('dev'));

  // Parse incoming request bodies as JSON
  app.use(require('body-parser').json());

  // Set Response Headers
  app.use(cors());

  // Set up routing
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
