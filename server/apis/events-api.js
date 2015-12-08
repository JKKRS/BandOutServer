var express   = require('express');
var mongoose  = require('../database/config');
var LiveEvent = require('../database/models/live');

var EventsAPI = express.Router();

// Get all live events
EventsAPI.get('/', function(req, res) {
  LiveEvent.find({}, function (err, event) {
    if (err) { console.log('Get All Error', err); return; }
    res.status(200).send(event);
  });
});

// Get a single event by it's ID
EventsAPI.get('/:eventID', function(req, res) {
  var eventID = req.params.eventID;
  LiveEvent.findOne({ id : eventID }, function(err, event) {
    if (err) { console.log('Get Single Event Error', err); return; }
    res.status(200).send(event);
  });
});

// Add a new live event
EventsAPI.post('/', function(req, res) {
  var newEvent = new LiveEvent(req.body);
  newEvent.save(function(err, event) {
    if (err) { console.log('newEvent Save ERR', err); return; }
    res.status(201).send(event);
  });
});

// Add an attendee to a specific live event, by event ID
EventsAPI.post('/:eventID', function(req, res) {
  var attendee = req.body;
  var eventID = req.params.eventID;
  LiveEvent.update({ id : eventID }, { $push: { attendees : attendee } }, { upsert: true }, function(err, event) {
    if (err) { console.log('Attendee Save ERR', err); return; }
    res.status(201).send(event);
  });
});

// Delete a live event by ID
EventsAPI.delete('/:eventID', function(req, res) {
  var eventID = req.params.eventID;
  LiveEvent.remove({ id : eventID }, function(err, response) {
    res.status(200).send(response);
  });
});

EventsAPI.delete('/:eventID/:attendeeFBID', function(req, res) {
  var eventID = req.params.eventID;
  var attendeeFBID = req.params.attendeeFBID;
  LiveEvent.update({ id : eventID }, { $pull: { attendees : { fbid : attendeeFBID } } }, function(err, response) {
    if (err) { console.log('Attendee Removal ERR', err); return; }
    res.status(200).send(response);
  });
});


module.exports = EventsAPI;