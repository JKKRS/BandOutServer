var express       = require('express');
var Path          = require('path');

// Routers
var routes = express.Router();
var userRouter = require('./apis/users-api');
var artistsRouter = require('./apis/artists-api');
var eventsRouter  = require('./apis/events-api');
var devicesRouter = require('./apis/devices-api');
var assetFolder   = Path.resolve(__dirname, './public/');
console.log(assetFolder);

module.exports = function(app, jwtAuth) {

  // Serve static assets
  app.use(express.static(assetFolder));

  // API Routes
  app.use('/apis/users', jwtAuth, userRouter);
  app.use('/apis/artists', jwtAuth, artistsRouter);
  app.use('/apis/events', jwtAuth, eventsRouter);
  app.use('/apis/devices', jwtAuth, devicesRouter);

  // The Catch-all Route
  // This is for supporting browser history pushstate.
  // NOTE: Make sure this route is always LAST.
  app.get('/*', function(req, res) {
    res.sendFile(assetFolder + '/index.html');
  });
};
