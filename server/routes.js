var express       = require('express');
var Path          = require('path');

// Routers
var routes = express.Router();
var userRouter = require('./apis/users-api');
var artistsRouter = require('./apis/artists-api');
var eventsRouter  = require('./apis/events-api');
var devicesRouter = require('./apis/devices-api');
var assetFolder   = Path.resolve(__dirname, './client/');

module.exports = function(app, jwtAuth) {

  // app.use(express.static( __dirname +'./client/www/assets/bootstrap.css'));
  // app.use('/*',  express.static(__dirname +'./client/www/assets'));

  app.use('/apis/users', jwtAuth, userRouter);
  app.use('/apis/artists', jwtAuth, artistsRouter);
  app.use('/apis/events', jwtAuth, eventsRouter);
  app.use('/apis/devices', jwtAuth, devicesRouter);

  // The Catch-all Route
  // This is for supporting browser history pushstate.
  // NOTE: Make sure this route is always LAST.
  app.get('/', function(req, res) {
    res.sendFile(assetFolder + '/www/index.html');
  });

  app.get('/assets/css/main.css', function(req, res) {
    res.sendFile(assetFolder + '/www/assets/css/main.css');
  });

  app.get('/assets/css/bootstrap.css', function(req, res) {
    res.sendFile(assetFolder + '/www/assets/css/bootstrap.css');
  });

  app.get('/assets/js/bootstrap.min.js', function(req, res) {
    res.sendFile(assetFolder + '/www/assets/js/bootstrap.min.js');
  });

  app.get('/assets/img/ipad-hand.png', function(req, res) {
    res.sendFile(assetFolder + '/www/assets/img/ipad-hand.png');
  });
  app.get('/assets/img/button-google-play.png', function(req, res) {
    res.sendFile(assetFolder + '/www/assets/img/button-google-play.png');
  });
  app.get('/assets/img/Rob_Soule_2.jpg', function(req, res) {
    res.sendFile(assetFolder + '/www/assets/img/Rob_Soule_2.jpg');
  });
  app.get('/assets/img/Scott_Schwartz_1.jpg', function(req, res) {
    res.sendFile(assetFolder + '/www/assets/img/Scott_Schwartz_1.jpg');
  });
  app.get('/assets/img/Kang_Lee_1.jpg', function(req, res) {
    res.sendFile(assetFolder + '/www/assets/img/Kang_Lee_1.jpg');
  });
  app.get('/assets/img/Kevin_Saldana_1.jpg', function(req, res) {
    res.sendFile(assetFolder + '/www/assets/img/Kevin_Saldana_1.jpg');
  });
  app.get('/assets/img/James_Hicks_2.jpg', function(req, res) {
    res.sendFile(assetFolder + '/www/assets/img/James_Hicks_2.jpg');
  });
  app.get('/assets/img/homePage.png', function(req, res) {
    res.sendFile(assetFolder + '/www/assets/img/homePage.png');
  });
  app.get('/assets/img/artistMap.png', function(req, res) {
    res.sendFile(assetFolder + '/www/assets/img/artistMap.png');
  });
  app.get('/assets/img/artistView.png', function(req, res) {
    res.sendFile(assetFolder + '/www/assets/img/artistView.png');
  });








};
