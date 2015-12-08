var express  = require('express');
var mongoose = require('../database/config');
var Device   = require('../database/models/device');

var DeviceAPI = express.Router();

DeviceAPI.post('/', function(req, res) {
  // req.body = { device_id: 'sdf123asdf', push: bool, 'location.coordinates': [long, lat] }
  var newDevice = new Device(req.body);
  newDevice.save(function(err, dev) {
    if (err) { console.log('newDevice Save ERR', err); return; }
    res.status(201).send(dev);
  });
});

// For Testing
DeviceAPI.get('/', function(req, res) {
  Device.find({}, function(err, dev) {
    if (err) { console.log('Device GET ERR', err); return; }
    res.status(200).send(dev);
  });
});

DeviceAPI.get('/:id', function(req, res) {
  var id = req.params.id;
  Device.findOne({ device_id : id }, function(err, dev) {
    if (err) { console.log('DevicesAPI ERR', err); return; }
    if (dev === null) {
      dev = { noDevice: true };
    }
    res.status(200).send(dev);
  });
});


DeviceAPI.put('/:id', function(req, res) {
  // req.body = {
  //    push: bool, 'location.coordinates':  [long, lat]
  // }
  var id = req.params.id;
  Device.update( { device_id : id }, { $set : req.body }, null, function(err, msg) {
    if (err) { console.log('Device PUT ERR', err); return; }
    res.status(202).send(msg);
  });
});

module.exports = DeviceAPI;
