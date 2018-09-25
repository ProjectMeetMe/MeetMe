// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var mysql = require('mysql');

//Establish mysql connection
var connection = mysql.createConnection({
	host: "104.42.79.90",
	user: "cpen321",
	password: "Test8as_"
});

connection.query('USE CPEN321'); // select db to use

//Export this file
module.exports = function(passport) {

/* PASSPORT SESSION SETUP */

// used to serialize the user for the session - called during successful login
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
	connection.query("SELECT * FROM users WHERE id = (?)", [id], function(err, result) {
		done(err, result[0]);
	});
});


/* SIGNUP STRATEGY */

passport.use('signup', new LocalStrategy({
	//required fields are email and password
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, email, password, done) {
	// find a user whose email is the same as the forms email
	// we are checking to see if the user trying to login already exists
	//   dbConnection.query("SELECT * FROM people where age = (?)", [ageX], function(err, rows){
    connection.query("SELECT * FROM users WHERE email = (?)", [email], function(err, result){
		console.log("Result: " + result);
		if (err)
        	return done(err);
		if (result.length) {
        	return done(null, false, req.flash('signupMessage', 'That email is already taken'));
    	} else {
			// if there is no user with that email
        	// create the user
        	var newUser = new Object();

			console.log ("Email: " + email);
			console.log ("Password: " + password);

			newUser.email    = email;
        	newUser.password = password; // use the generateHash function in our user model

			connection.query("INSERT INTO users ( email, password) values (?, ?)", [email, password], function(err, result){
				console.log("Query result: " + result);
				newUser.id = result.insertId;
				return done(null, newUser);
			});
    	}
	});
}));


/* LOGIN STRATEGY */

passport.use('login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, email, password, done) { // callback with email and password from our form
    connection.query("SELECT * FROM users WHERE email = (?)", [email], function(err, result){
		if (err)
            return done(err);
		if (!result.length) {
			console.log("No user found");
            return done(null, false, req.flash('loginMessage', 'Wrong user'));
        }

		// if the user is found but the password is wrong
        if (!( result[0].password == password)) {
			console.log("Incorrect password");
            return done(null, false, req.flash('loginMessage', 'Wrong password'));
		}

        // all is well, return successful user
        console.log("Login success: " + JSON.stringify(result[0]));
        return done(null, result[0]);

	});
}));

}
