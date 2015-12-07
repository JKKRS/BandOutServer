var express  = require('express');
var mongoose = require('../database/config');

var EventsAPI = express.Router();

EventsAPI.get('/', function(req, res) {
  console.log('wreck dat body', req.body);
  res.status(200).send('it worked');
});

module.exports = EventsAPI;