const moongose = require('mongoose');

const deviceSchema = new moongose.Schema({
  name: {
    type: String,
    required: true
  },
  createdBy: {
    type: moongose.Schema.Types.ObjectId,
    ref: 'user'
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

const Device = moongose.model('device', deviceSchema);

module.exports = Device;
