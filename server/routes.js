var express       = require('express');
var Path          = require('path');
// TEMPORARY
var artists       = require('./routes/artist_faked');

// Routers
var routes        = express.Router();
var userRouter    = require('./apis/users-api');
var artistsRouter = require('./apis/artists-api');
var assetFolder   = Path.resolve(__dirname, '../client/');

module.exports = function(app, jwtAuth) {
  app.use('/apis/users', userRouter, jwtAuth);
  app.use('/apis/artists', artistsRouter, jwtAuth);

  // TEMPORARY
  app.get('/artists', artists.findAll);
  app.get('/artists/:id', artists.findById);
  app.get('/events', artists.findAllEvents);

  // The Catch-all Route
  // This is for supporting browser history pushstate.
  // NOTE: Make sure this route is always LAST.
  app.get('/*', function(req, res){
    res.status(404).send();
    // res.sendFile( assetFolder + '/www/index.html' );
  });
};
