/* Routes related to account creation/login -> does NOT require a JSON web token for authentication */

var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var passport = require("passport");
var config = require("config");

var authController = require("../controllers/auth.js");

router.post("/signup", function(req, res, next) {
    //Custom callback
    passport.authenticate("local-signup", {
		session:false
	}, function(err, user, info) {
        if (err) {
            return res.status(400).json({ //unknown error
                message: "Some error encountered"
            });
        }
        if (!user) {
            return res.status(400).json({ //send relevant error message
                message: info.message
            });
        }
        return res.status(200).json({
            message: "Successful signup"
        });
    })(req, res, next);
});


router.post("/signin", function(req, res, next) {
    //Custom callback
    passport.authenticate("local-signin", {
        session: false
    }, function(err, user, info) {
        if (err) {
            return res.status(400).json({ //unknown error
                message: "Some error encountered"
            });
        }
        if (!user) {
            return res.status(400).json({ //send relevant for invalid user info
                message: info.message
            });
        }
        req.login(user, {
            session: false
        }, function(err) {
            if (err) {
                return next(err);
            }
            //successful login:
            //1st param = payload, 2nd param = secret(for encryption), 3rd param = expiry date for jwt
            const token = jwt.sign(user, config.get("jwtSecret"), {expiresIn: "30d"});

            return res.status(200).json({ //give out a valid jwt token to frontend for authentication purposes
                user,
                token,
				message: "Successful login"
            });
        });
    })(req, res);
});

/*
Requires email
 */
router.post("/forgotPassword", authController.sendEmail, authController.resetDBPass);

module.exports = router;
