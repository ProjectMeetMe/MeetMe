/* Routes related to account creation/login -> does NOT require a JSON web token for authentication */

var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var passport = require("passport");


router.post('/signup', function(req, res, next) {
    //Custom callback
    passport.authenticate('local-signup', {
		session:false
	}, function(err, user, info) {
        if (err) {
            return res.status(400).json({
                message: "Some error encountered"
            });
        }

        if (!user) {
            return res.status(400).json({
                message: info.message
            }); //send relevant error message
        }
        return res.status(200).json({
            message: "Successful signup"
        });

    })(req, res, next);
});


router.get('/logout', function(req, res) {
    //need to destroy token?
});


router.post('/signin', function(req, res, next) {
    //Custom callback
    passport.authenticate('local-signin', {
        session: false
    }, function(err, user, info) {
        if (err) {
            return res.status(400).json({
                message: "Some error encountered"
            });
        }

        if (!user) {
            return res.status(400).json({
                message: info.message
            }); //send relevant error message
        }

        req.login(user, {
            session: false
        }, function(err) {
            if (err) {
                return next(err);
            }
            //successful login:
            //1st param = payload, 2nd param = secret(for encryption), 3rd param = expiry date for jwt
            const token = jwt.sign(user, 'your_jwt_secret', {expiresIn: '1d'});
            return res.status(200).json({ //give out a valid jwt token to frontend
                user,
                token
            });

        });

    })(req, res);
});

module.exports = router;
