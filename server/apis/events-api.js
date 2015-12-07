var express   = require('express');
var mongoose  = require('../database/config');
var LiveEvent = require('../database/models/live');

var EventsAPI = express.Router();

EventsAPI.get('/', function(req, res) {
  LiveEvent.find({}, function (err, event) {
    if (err) { console.log('Get All Error', err); return; }
    res.status(200).send(event);
  });
});

EventsAPI.get('/:eventID', function(req, res) {
  var eventID = req.params.eventID;
  console.log('eventID (api):',  eventID)
  LiveEvent.findOne({ id : eventID }, function(err, event) {
    console.log("event (api):", event)
    if (err) { console.log('Get Single Event Error', err); return; }
    res.status(200).send(event);
  });
});

EventsAPI.post('/', function(req, res) {
  var newEvent = new LiveEvent(req.body);
  newEvent.save(function(err, event) {
    if (err) { console.log('newEvent Save ERR', err); return; }
    res.status(201).send(event);
  });
});

EventsAPI.post('/:eventID', function(req, res) {
  var attendee = req.body;
  var eventID = req.params.eventID;
  LiveEvent.update({ id : eventID }, { $push: { attendees : attendee } }, { upsert: true }, function(err, event) {
    if (err) { console.log('Attendee Save ERR', err); return; }
    console.log("Added:", event);
    res.status(201).send(event);
  })
  // console.log('eventID (api)', eventID);
  // console.log('attendee (api)', attendee);
});


module.exports = EventsAPI;