const mongoose = require('mongoose');

const requestStatus = {
  PENDING: 'Pending Acceptance',
  AWAITING_DEVICE: 'Awaiting device',
  BEING_REPAIRED: 'Being repaired',
  COMPLETED: 'Completed',
};

const requestSchema = new mongoose.Schema({
  usersname: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  device: {
    type: String,
    required: true,
  },
  typeOfRepairs: [
    {
      name: String,
      cost: Number,
    },
  ],
  description: {
    type: String,
    required: true,
    maxlength: 250,
  },
  status: {
    type: String,
    default: requestStatus.PENDING,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Request = mongoose.model('request', requestSchema);

module.exports = Request;
