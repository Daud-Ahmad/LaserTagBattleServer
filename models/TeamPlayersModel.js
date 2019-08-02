const mongoose = require('mongoose');

const TeamPlayerSchema = new mongoose.Schema({
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
  },
  teamId: {
    type: String,
    required: true
  }
});

module.exports = TeamPlayerSchema = mongoose.model(
  'teamPlayers',
  TeamPlayerSchema
);
