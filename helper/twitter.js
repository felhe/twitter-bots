var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  bearer_token: process.env.TWITTER_BEARER_TOKEN
});

var getUser = function (screen_name,  callback) {
  client.get('users/show', {screen_name: screen_name, include_entities: false}, function(error, user, response) {
    callback(user, error);
  });
}

var bulkUsers = function (userIds) {
  return new Promise(function(resolve, reject) {
    client.get('users/lookup', {user_id: userIds.join(","), include_entities: false}, function(error, users, response) {
      if (!error) {
        resolve(users);
      } else {
        reject(error);
      }
    });
  });
}

module.exports = {
  getUser: getUser,
  bulkUsers: bulkUsers
}