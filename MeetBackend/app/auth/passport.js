/* Passport strategies for authentication */

var bCrypt = require("bcrypt-nodejs");
var passportJWT = require("passport-jwt");
var JWTStrategy = passportJWT.Strategy;
var ExtractJWT = passportJWT.ExtractJwt;
var moment = require("moment");
var passport = require("passport");
var config = require("config");

var db = require("../models/sequelize.js");
var LocalStrategy = require("passport-local").Strategy;

/* LOCAL SIGNUP */
passport.use("local-signup", new LocalStrategy({
        //Override regular required fields
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        if (password.length < 8) {
            return done(null, false, {
                message: "Error: Password must be at least 8 characters"
            });
        }

        //encrypts password
        var generateHash = function(password) {
            return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
        };

        db.user.findOne({
            where: {
                email: email
            }
        }).then(function(userFound) {
            if (userFound) {
                return done(null, false, {
                    message: "Error: That email is already taken"
                });
            } else {
                var userPassword = generateHash(password);
                var userData = {
                    email: email,
                    password: userPassword,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    schedule: {}
                };

                db.user.create(userData).then(function(newuser) {
                    if (!newuser) {
                        return done(null, false);
                    } else {
                        return done(null, newuser); //return new user object (successful creation)
                    }
                }).catch(function(error) { //email invalid or some other creation error
                    return done(null, false, {
                        message: "Error: Invalid email format",
                    });
                });
            }
        });
    }
));

/* LOCAL SIGNIN */
passport.use("local-signin", new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },

    function(req, email, password, done) {
        var isValidPassword = function(userpass, password) { //userpass == encrypted password
            return bCrypt.compareSync(password, userpass);
        }
        db.user.findOne({
            where: {
                email: email
            }
        }).then(function(userFound) {
            if (!userFound) { //no user found, wrong email
                return done(null, false, {
                    message: "Error: Email does not exist"
                });
            }
            if (!isValidPassword(userFound.password, password)) { //user found but passwords dont match
                return done(null, false, {
                    message: "Error: Incorrect password"
                });
            }

            //Update login time
            userFound.update({
                lastLogin: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
            }).then(function(updatedUser) {
                return done(null, updatedUser.get());
            });
            return null; //suppress warnings

        }).catch(function(err) {
            return done(null, false, {
                message: "Error: Something went wrong with your signin"
            });
        });
    }
));

/* JSON WEB TOKEN AUTHENTICATION */
passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.get("jwtSecret")
    },
    function(jwtPayload, cb) { //jwtPayload contains user info unencrypted

        //Tokens are valid if last login time matches and the user has not logged out since
        db.user.findOne({
                where: {
                    id: jwtPayload.id,
                    password: jwtPayload.password,
                    lastLogin: jwtPayload.lastLogin //last login time must match or token is invalid
                }
            })
            .then(function(userFound) {
                if (!userFound) { //no matching database entry - lastlogin invalid
                    return cb(null);
                }
				if (userFound.lastLogout != null && userFound.lastLogout > userFound.lastLogin){ //if a logout occured after the lastlogin, invalid token
					return cb(null);
				}

                return cb(null, userFound.get()); //pass on user object to next function
            })
            .catch(function(err) {
                return cb(err);
            })
    }));
