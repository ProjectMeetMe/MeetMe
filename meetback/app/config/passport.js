/* Passport strategies for authentication */

var bCrypt = require('bcrypt-nodejs');
var passportJWT = require('passport-jwt');
var JWTStrategy = passportJWT.Strategy;
var ExtractJWT = passportJWT.ExtractJwt;
var moment = require('moment');



module.exports = function(passport, user) {

    var User = user; // required for sequelize - treat user as a global class
    var LocalStrategy = require('passport-local').Strategy;

    /*
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
	*/

    /* Deserializes user - used for persistent sessions */
    /*
    passport.deserializeUser(function(id, done) {
        User.findById(id).then(function(user) {
            if (user)
                done(null, user.get());
            else
                done(user.errors, null);
        });
    });*/

    /* LOCAL SIGNUP */
    passport.use('local-signup', new LocalStrategy({
            //Override regular required fields
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            //encrypts password
            var generateHash = function(password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };

            //If sequelize finds matching email in DB ...
            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
                if (user) {
                    console.log("EMAIL TAKEN");
                    return done(null, false, {
                        message: 'That email is already taken'
                    });
                } else {
                    var userPassword = generateHash(password);
                    var userData = {
                        email: email,
                        password: userPassword,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname
                    };
                    console.log(JSON.stringify(userData));
                    //Creates a new entry in the database
                    User.create(userData).then(function(newUser, created) {
                        if (!newUser) {
                            return done(null, false); //failed
                        }
                        if (newUser) {
                            return done(null, newUser); //return new user object
                        }
                    });
                }
            });
        }
    ));

    /* LOCAL SIGNIN */
    passport.use('local-signin', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },

        function(req, email, password, done) {
            var isValidPassword = function(userpass, password) {
                return bCrypt.compareSync(password, userpass);
            }
            //If sequelize finds matching email in DB ...
            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
                if (!user) {
                    console.log("WRONG EMAIL");
                    return done(null, false, {
                        message: 'Email does not exist'
                    });
                }
                if (!isValidPassword(user.password, password)) {
                    console.log("WRONG PASSWORD");
                    return done(null, false, {
                        message: 'Incorrect password'
                    });
                }
                var userinfo = user.get();
                console.log("SUCCESSFUL LOGIN:")
                console.log(JSON.stringify(userinfo));

                //Update login time (for purposes of generating unique JWT each login)
                user.update({
                    last_login: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                });
                //console.log(JSON.stringify(moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')));

                return done(null, userinfo);
            }).catch(function(err) {
                console.log("Error:", err);
                return done(null, false, {
                    message: 'Something went wrong with your signin'
                });
            });
        }
    ));

    /* JSON WEB TOKEN AUTHENTICATION */
    passport.use(new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'your_jwt_secret'
        },
        function(jwtPayload, cb) {

            //Find the user in db
            User.findOne({
                    where: {
                        id: jwtPayload.id
                    }
                })
                .then(function(user) {
                    var userinfo = user.get();
                    return cb(null, userinfo);
                })
                .catch(function(err) {
                    return cb(err);
                })
        }));

}
