var express  = require('express');
var mongoose = require('../database/config');
var User     = require('../database/models/user');
var push = require('../helpers/push');

var UsersAPI = express.Router();

UsersAPI.post('/', function(req, res) {
  var newUser = new User(req.body);
  newUser.save(function(err, user) {
    if (err) { console.log('newUser Save ERR', err); return; }
    res.status(201).send(user);
  });
});

UsersAPI.get('/', function(req, res) {
  User.find({}, function(err, user) {
    if (err) { console.log('User GET ERR', err); return; }
    res.status(200).send(user);
  });
});

UsersAPI.get('/:id', function(req, res) {
  var id = req.params.id;
  User.findOne({ fbid : id }, function(err, user) {
    if (err) { console.log('UsersAPI ERR', err); return; }
    if (user === null) {
      user = { nouser: true };
    }
    res.status(200).send(user);
  });
});

UsersAPI.put('/:id', function(req, res) {
  var id = req.params.id;
  User.update( { fbid : id }, { $set : req.body }, null, function(err, msg) {
    if (err) { console.log('User PUT ERR', err); return; }

    // only send push notifications if artist is live and location coordinates exists
    if (req.body.live && req.body['location.coordinates']) {
      push.notifyUsers(id, req.body);
    }

    res.status(202).send(msg);
  });
});

module.exports = UsersAPI;
