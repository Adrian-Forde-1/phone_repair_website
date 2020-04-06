const mongoose = require('mongoose');

const typeOfRepairSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'device'
  },
  deviceName: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

const TypeOfRepairModel = mongoose.model('typeOfRepair', typeOfRepairSchema);

module.exports = TypeOfRepairModel;
