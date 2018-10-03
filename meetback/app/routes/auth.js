/* Routes related to account creation/login -> does NOT require a JSON web token for authentication */

var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var passport = require("passport");


router.post('/signup', function(req, res, next) {
    //Custom callback
    passport.authenticate('local-signup', function(err, user, info) {
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
        }); //send user object, may not be necessary

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
            //successful login
            const token = jwt.sign(user, 'your_jwt_secret'); //second param is key for encryption, using user as seed
            return res.status(200).json({
                user,
                token
            });

        });
    })(req, res, next);
});

module.exports = router;
