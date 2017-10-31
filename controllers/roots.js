var express = require('express');
var router = express.Router();
var Root = require('../models/root');
var User = require('../models/user');
var Twitter = require('../helper/twitter');

router.post('/add', function (req, res) {
  var newRootName = req.body.name;
  console.log(req.body.name);
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

router.get('/', async function (req, res) {
  var response = await Root.find({}).exec();
  var roots = [];
  var queries = [];
  response.forEach(function (root, i) {
    roots[i] = {};
    roots[i].name = root.screen_name;
    roots[i].tweets = root.tweets.length;
    queries.push(User.find({belongs_to: root._id}).sort({ count: 'desc' }).lean())
  });
  var allUsers = await Promise.all(queries);
  for (var i = 0; i < roots.length; i++) {
    allUsers[i].map(function (v) {
      v.percentage = Math.round(v.count/roots[i].tweets*1000)/10;
      var diffdays =  Math.floor(( v.last_fetch - v.account_create ) / 86400000);
      v.tweet_rate = Math.round(v.tweet_amount/diffdays*100)/100;
    });
    roots[i].retweeters = allUsers[i];
  }
  res.json(roots);
});

module.exports = {
  router: router
};