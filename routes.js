var express    = require('express');
var router = express.Router();
var controller = require('./controller').router;

router.get('/', function (req, res) {
  res.send('Welcome!');
});

router.use('/root', controller);

module.exports = router;