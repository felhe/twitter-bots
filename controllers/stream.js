var Root = require('../models/root');
var User = require('../models/user');

function insertTweet(tweet) {
  Root.findOneAndUpdate({id: tweet.tweeter_id}, { $push: { tweets: tweet.tweet_id } }, function (error) {
    if (error) throw error;
    console.log('New Tweet added!');
  })
}

function insertRetweet(retweet, callback) {
  Root.find({ id: retweet.tweeter_id }, function(err, root) {
    if (err) throw err;
    root = root[0];

    if (root.tweets.indexOf(retweet.tweet_id) > -1) {
      var newUser = {
        id: retweet.retweeter_id,
        screen_name: retweet.retweeter_name,
        belongs_to: root
      };
      User.update(
        {id: newUser.id, belongs_to: root},
        {$set: newUser, $inc : {count:1}},
        {upsert: true},
        function (error) {
          if (error) throw error;
          console.log('Retweet added!');
        }
      )
    }

  });
}

function getAllRoots(callback) {
  Root.find({}, function(err, roots) {
    if (err) throw err;

    var all = roots.map(function(elem){
      return elem.id;
    });
    callback(all);
  });
}

module.exports = {
  insertRetweet: insertRetweet,
  insertTweet: insertTweet,
  getAllRoots: getAllRoots,
};