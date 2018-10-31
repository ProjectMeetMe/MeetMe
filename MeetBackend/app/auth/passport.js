/* Passport strategies for authentication */

var bCrypt = require("bcrypt-nodejs");
var passportJWT = require("passport-jwt");
var JWTStrategy = passportJWT.Strategy;
var ExtractJWT = passportJWT.ExtractJwt;
var moment = require("moment");
var passport = require("passport");
var config = require("config");

var db = require("../models/sequelize.js"); //load models
var LocalStrategy = require("passport-local").Strategy;

/* LOCAL SIGNUP */
passport.use("local-signup", new LocalStrategy({
        //Override regular required fields
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        //encrypts password
        var generateHash = function(password) {
            return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
        };

        //If sequelize finds matching email in DB ...
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
                        return done(null, false); //failed
                    } else {
                        return done(null, newuser); //return new user object
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
        var isValidPassword = function(userpass, password) { //userpass = encrypted password
            return bCrypt.compareSync(password, userpass);
        };
        //If sequelize finds matching email in DB ...
        db.user.findOne({
            where: {
                email: email
            }
        }).then(function(userFound) {
            if (!userFound) { //no user found, wrong email
                return done(null, false, {
                    message: "Email does not exist"
                });
            }
            if (!isValidPassword(userFound.password, password)) { //user found but passwords dont match
                return done(null, false, {
                    message: "Incorrect password"
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

        //Find the user in db
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
                return cb(null, userFound.get()); //pass on user object to next function
            })
            .catch(function(err) { //payload is nonsense
                return cb(err);
            });
    }));
