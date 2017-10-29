var mongoose = require('mongoose');

var rootSchema = mongoose.Schema({
  id: String,
  screen_name: String,
  tweets: [],
  retweeters: [{
    id: String,
    screen_name:  String,
    count: Number
  }]
});

var Root = mongoose.model('Root', rootSchema);

module.exports = Root;