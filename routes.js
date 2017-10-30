var express    = require('express');
var router = express.Router();
var rootController = require('./controllers/roots').router;

router.get('/', function (req, res) {
  res.send('Welcome!');
});

router.use('/root', rootController);

module.exports = router;