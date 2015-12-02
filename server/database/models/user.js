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

var eventSchema = new Schema({
  id: Number,
  title: String,
  datetime: Date,
  description: String,
  venue: venueSchema
});

var artistSchema = new Schema({
  fbid: String,
  artist_name: String,
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
  favorite_artists: [],
  artist: { type: Boolean, default: false },
  artist_info: artistSchema,
  live: { type: Boolean, default: false },
  location: {
    'type': {
      type: String,
      enum: 'Point',
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0,0]
    }
  }
});

userSchema.index({ location: '2dsphere' });

var User = mongoose.model('User', userSchema);

module.exports = User;

// GET  /users/all     -> returns all users in array
// GET  /users/artists -> returns all users with .artist === true
// GET  /users/:id     -> returns single user where :id === _id
// POST /users         -> expects an {} to be sent with attributes in schema
