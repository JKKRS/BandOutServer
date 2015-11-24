var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = new Schema({
  pos: [Number],
  type: String
});

locationSchema.index({ "pos" : "2dsphere"});


var venueSchema = new Schema({
  name: String,
  address: String,
  zip: String,
  city: String,
  country: String,
  loc: [locationSchema]
});

var eventSchema = new Schema({
  id: Number,
  title: String,
  datetime: Date,
  description: String,
  venue: [venueSchema]
});

var artistSchema = new Schema({
  fbid: String,
  name: String,
  paypal_link: String,
  website: String,
  upcoming_events: [eventSchema]
});

var userSchema = new Schema({
  auth_info : {
    accessToken: String,
    expiresIn: Number,
    signedRequest: String
  },
  fbid: { type : String, unique : true, required : true },
  name: { type : String, required : true },
  image: String,
  email: String,
  twitter: String,
  artist: Boolean,
  artist_info: [artistSchema]
});

var User = mongoose.model('User', userSchema);

module.exports = User;

// GET  /users/all     -> returns all users in array
// GET  /users/artists -> returns all users with .artist === true
// GET  /users/:id     -> returns single user where :id === _id
// POST /users         -> expects an {} to be sent with attributes in schema
