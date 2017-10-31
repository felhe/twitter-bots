var express = require('express');
var router = express.Router();
var Root = require('../models/root');
var User = require('../models/user');
var Twitter = require('../helper/twitter');

router.get('/analyse', async function (req, res) {
  var allUsers = await User.find({}, 'id').exec();
  allUsers = allUsers.map(function(elem){
    return elem.id;
  });
  var chunk = [];
  var queries =[];

  while (allUsers.length > 0) {
    chunk = allUsers.splice(0,100);
    queries.push(Twitter.bulkUsers(chunk));
  }

  var allUsersData = await Promise.all(queries);
  var merged = [].concat.apply([], allUsersData);

  merged.forEach(function(obj) {
    var date = new Date(obj.created_at);
    User.update({id: obj.id_str}, {$set: {tweet_amount: obj.statuses_count, account_create: date}}, function (error) {
      //console.log(error);
    });
  });

  res.json(true);
});

module.exports = {
  router: router
};