var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deviceSchema = new Schema({
  device_id: { type : String, unique : true, required : true },
  push: { type: Boolean, default: true },
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

deviceSchema.index({ location: '2dsphere' });

var Device = mongoose.model('Device', deviceSchema);

module.exports = Device;

