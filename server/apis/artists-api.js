var express = require('express');
var mongoose = require('../database/config');
var User    = require('../database/models/user');
var push = require('../helpers/push');

var ArtistsAPI = express.Router();

ArtistsAPI.post('/', function(req, res) {
  var newArtist = new User(req.body);
  newArtist.save(function(err, artist) {
    if (err) { return err; }
      res.status(201).send(artist);
  });
});

ArtistsAPI.get('/', function(req, res) {
  User.find({ artist : true }, function(err, artist) {
    if (err) { return err; }
      res.status(200).send(artist);
  });
});

ArtistsAPI.get('/:id', function(req, res) {
  var id = req.params.id;
  User.findOne({ fbid : id, artist : true }, function(err, artist) {
    if (err) { return err; }
    res.status(200).send(artist);
  });
});

ArtistsAPI.put('/:id', function(req, res) {
  var id = req.params.id;
  User.update( { fbid : id }, { $set : req.body }, null, function(err, msg) {
    if (err) { return err; }

    // only send push notifications if artist is live and location coordinates exists
    if (req.body.live && req.body['location.coordinates']) {
      push.notifyUsers(id, req.body);
    }

    res.status(202).send(msg);
  });
});

ArtistsAPI.post('/live', function(req, res) {
  var longitude, latitude, dist;
  longitude = Number(req.body.location[0]);
  latitude = Number(req.body.location[1]);
  dist = Number(req.body.distance) || 5000;

  User.find({
    artist: true,
    live: true,
    location: {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        $maxDistance: dist
      }
    }
  }, function(err, liveArtists) {
    if (err) { console.log('Artists/LIVE ERR', err); return; }
    res.status(200).send(liveArtists);
  });
});

// Get all live artists
ArtistsAPI.get('/live', function(req, res) {
  User.find( { artist : true, live : true }, function(err, artists) {
    if (err) { console.log('Artists/Live GET Error', err); return; }
    res.status(200).send(artists);
  });
});

module.exports = ArtistsAPI;
