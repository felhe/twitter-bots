var Twitter = require('twitter');
var controller = require('./controllers/stream');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var startStream = function () {
  controller.getAllRoots(function (roots) {
    var stream = client.stream('statuses/filter', {follow: roots.join(",")});

    stream.on('data', function(event) {
      if (event.retweeted_status && (roots.indexOf(event.retweeted_status.user.id_str) > -1)) {
        saveRetweet(event);
      }
      if (roots.indexOf(event.user.id_str) > -1) {
        saveTweet(event);
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

  function saveTweet(tweet) {
    tweet = {
      tweeter_id: tweet.user.id_str,
      tweet_id: tweet.id_str
    };

    controller.insertTweet(tweet, function (error) {
      if (error) throw error;
    });
  }
};

module.exports = {
  start: startStream
};