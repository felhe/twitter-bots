var express    = require('express');
var router = express.Router();
var rootController = require('./controllers/roots').router;
var userController = require('./controllers/userData').router;

router.get('/', function (req, res) {
  res.send('Welcome!');
});

router.use('/root', rootController);
router.use('/user', userController);



module.exports = router;