var express = require('express');
var router = express.Router();
var Root = require('./models/root');
var Twitter = require('./helper/twitter');

function insertRetweet(retweet, callback) {
  Root.find({ id: retweet.tweeter_id }, function(err, user) {
    if (err) throw err;
    user[0].tweets.indexOf(retweet.tweet_id) === -1 ? user[0].tweets.push(retweet.tweet_id) : true;
    var obj = user[0].retweeters.find(x => x.id === retweet.retweeter_id);
    if (obj) obj.count++;
    else {
      var newRetweeter = {
        id: retweet.retweeter_id,
        count: 1,
        screen_name: retweet.retweeter_name
      };
      user[0].retweeters.push(newRetweeter);
    }
    // save the user
    user[0].save(function(err) {
      if (err) throw err;
      console.log('Retweet added');
      callback(false);
    });
  });
}

function getAllRoots(callback) {
  Root.find({}, function(err, roots) {
    if (err) throw err;

    var all = roots.map(function(elem){
      return elem.id;
    }).join(",");
    callback(all);
  });
}

router.get('/', function (req, res) {
  var newRootName = 'SPIEGELONLINE';
  Twitter.getUser(newRootName, function (user, error) {
    if (error) throw error;
    addRoot(user.id_str, user.screen_name);
  });

  function addRoot(id, name) {
    var newRoot = {
      id: id,
      screen_name: name
    };
    Root.update(
      {id: newRoot.id},
      {$setOnInsert: newRoot},
      {upsert: true},
      function (error) {
        if (error) throw error;
        console.log('New Root added!');
        res.send('success');
      }
    )
  }
});

module.exports = {
  insertRetweet: insertRetweet,
  getAllRoots: getAllRoots,
  router: router
};