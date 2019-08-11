const mongoose = require('mongoose');

const TeamPlayerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  killBy: {
    type: String
  },
  teamId: {
    type: String,
    required: true
  }
});

module.exports = TeamPlayer = mongoose.model('teamPlayers', TeamPlayerSchema);
