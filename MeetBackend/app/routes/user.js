/* User based routes, all require authentication with JWT */
/* req contains user object for all user info*/

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('This is the root page');
});

/* GET user profile. */
router.get('/profile', function(req, res, next) {
	console.log("Successful access to profile page");
    res.send(req.user);
});

/* GET user profile. */
router.get('/logout', function(req, res, next) {
	console.log("Successful access to logout");
	//Should do something here to invalidate the current token, perhaps with a blacklist of token values
    res.send(req.user);
});

module.exports = router;
