var Twitter = require('twitter');
var controller = require('./controller');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var startStream = function () {
  controller.getAllRoots(function (roots) {
    var stream = client.stream('statuses/filter', {follow: roots});

    stream.on('data', function(event) {
      if (event.retweeted_status) {
        console.log('retweet');
        saveRetweet(event);
      }
    });

    stream.on('error', function(error) {
      throw error;
    });
  });

  function saveRetweet(tweet) {
    var retweet = {
      retweeter_id: tweet.user.id_str,
      retweeter_name: tweet.user.screen_name,
      tweeter_id: tweet.retweeted_status.user.id_str,
      tweet_id: tweet.retweeted_status.id_str
    };

    controller.insertRetweet(retweet, function (error) {
      if (error) throw error;
    });
  }
};

module.exports = {
  start: startStream
};