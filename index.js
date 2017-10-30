var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

var stream = require('./stream');
var routes = require('./routes');
var db = require('./db');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

stream.start(function (error) {
  if (error) throw error;
  console.log('Stream started!');
});

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use('/', routes);

app.listen(port);
console.log('Server started on port ' + port);