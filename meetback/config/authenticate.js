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

// =========================================================================
// passport session setup ==================================================
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
	connection.query("select * from users where id = "+id,function(err,rows) {
		done(err, rows[0]);
	});
});

// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'

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
        	return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
    	} else {
			// if there is no user with that email
        	// create the user
        	var newUser = new Object();

			console.log ("Email: " + email);
			console.log ("Password: " + password);

			newUser.email    = email;
        	newUser.password = password; // use the generateHash function in our user model

			var insertQuery = "INSERT INTO users ( email, password, id ) values (?, ?, ?), [email, password, 1]";
			console.log(insertQuery);
			connection.query(insertQuery, function(err, result){
				console.log("Query result: " + result);
				newUser.id = result.id;
				return done(null, newUser);
			});
    	}
	});
}));


// =========================================================================
// LOCAL LOGIN =============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'

passport.use('login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, email, password, done) { // callback with email and password from our form
	console.log("TEST");
    connection.query("SELECT * FROM `users` WHERE `email` = '" + email + "'",function(err,rows){
		if (err)
            return done(err);
		if (!rows.length) {
            return done(null, false, req.flash('loginMessage', 'No user found.'));
        }

		// if the user is found but the password is wrong
        if (!( rows[0].password == password))
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

        // all is well, return successful user
        return done(null, rows[0]);

});
}));

}
