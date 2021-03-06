var mongoose = require('mongoose');
var mongoURI = process.env.MONGO_COMPOSE_URI;

if (!mongoURI || process.env.NODE_ENV === 'test') {
  if (process.env.NODE_ENV === 'test') {
    mongoURI = 'mongodb://localhost/bandout';
  } else {
    mongoURI = require('../../.env').MONGO_COMPOSE_URI;
    // mongoURI = 'mongodb://localhost/bandout';
  }
}

var config = {
  mongoUrl: mongoURI
};

mongoose.connect(config.mongoUrl);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
  //console.log('connected to mongo');
});

module.exports = mongoose;
