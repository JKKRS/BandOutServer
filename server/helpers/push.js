var express = require('express');
var mongoose = require('../database/config');
var gcm = require('node-gcm');

var User = require('../database/models/user');
var Device = require('../database/models/device');

module.exports = {
  notifyUsers: function(id, queryInfo) {
    // id = fbid string
    // queryInfo = { live: boolean, 'location.coordinates': [long, lat] }
    var longitude, latitude;
    longitude = Number(queryInfo['location.coordinates'][0]);
    latitude = Number(queryInfo['location.coordinates'][1]);
    // get artist info:
    User.findOne({ fbid : id, artist : true }, function(err, artist) {
      if (err) { console.log('notifyUsers userFindOne err', err); return err; }

      // find devices within range, that have push notifications true
      Device.find({
        push: true,
        location: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude]
            },
            $maxDistance: 500
          }
        }
      }, 'device_id', function(err, devicesToNotify) {
        if (err) { console.log('notifyUsers deviceFind ERR', err); return err; }
        var title = (artist.artist_info.artist_name || artist.name) + 'is Live!';
        var body = 'Show your support, be a part of the experience.';
        gcmNotify(title, body, artist.artist_info, devicesToNotify);
      });
    });
  }
};

// Helpers
// Android Specific
function gcmNotify(title, body, payload, deviceTokens) {
  var api = process.env.GOOGLE_SERV_API || require('../../.env').GOOGLE_SERV_API;
  var sender = new gcm.Sender(api);
  var message = new gcm.Message();
  message.addNotification({
    title: title,
    body: body
  });

  message.addData({
    paypal_link: payload.paypal_link
  });

  deviceTokens = deviceTokens || ['eEas6KIBJNU:APA91bEFIPu2yNc2bPB0Cu_qCEdFLNpIvAe18E1OYApCRBQ5ERUSBzStSvgcjETwtReAi0qM2P5ypTXUHiiFmtw_Jw0LtQgiwQmHwQg0V-t2jfpMGoB2GDTtX6SVHYzYxvm_6kViDYnQ'];

  sender.send(message, { registrationTokens: deviceTokens }, function(err, response) {
    if (err) { console.log('Error sending pushies', err); return;}
    console.log('push response: ', response);
  });
}

// gcmNotify('doots', 'loots', {paypal_link:'https://www.paypal.me/rsoule3'});
