var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  id: String,
  screen_name: String,
  belongs_to: { type: mongoose.Schema.Types.ObjectId, ref: 'Root' },
  count: { type: Number, default: 1 },
  tweet_amount: Number,
  account_create: Date
});

var User = mongoose.model('User', userSchema);

module.exports = User;