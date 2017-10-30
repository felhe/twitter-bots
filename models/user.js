var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  id: String,
  screen_name: String,
  belongs_to: { type: mongoose.Schema.Types.ObjectId, ref: 'Root' },
  count: { type: Number, default: 1 }
});

var User = mongoose.model('User', userSchema);

module.exports = User;