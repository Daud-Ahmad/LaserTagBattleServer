const mongoose = require('mongoose');

const IndividualPlayerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  isAlive: {
    type: Boolean,
    default: true
  },
  irId: {
    type: String,
    required: true
  },
  killBy: {
    type: String
  }
});

module.exports = IndividualPlayer = mongoose.model(
  'individualPlayer',
  IndividualPlayerSchema
);
