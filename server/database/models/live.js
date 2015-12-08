var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var venueSchema = new Schema({
  name: String,
  address: String,
  zip: String,
  city: String,
  country: String,
  latitude: Number,
  longitude: Number
});

var liveEventSchema = new Schema({
  id: Number,
  title: String,
  datetime: Date,
  description: String,
  attendees: [],
  venue: venueSchema
})

var Live = mongoose.model('LiveEvents', liveEventSchema);

module.exports = Live;