/* User based routes, all require authentication with JWT */

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('This is the root page');
});

/* GET user profile. */
router.get('/profile', function(req, res, next) {
	console.log("Successful access to user page");
    res.send(req.user);
});

module.exports = router;
