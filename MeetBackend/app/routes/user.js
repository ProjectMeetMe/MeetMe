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
	return res.status(200).json(req.user);
});

/* GET user profile. */
router.get('/logout', function(req, res, next) {
    //Should do something here to invalidate the current token, perhaps with a blacklist of token values
    return res.status(200).json(req.user);
});

module.exports = router;
