//load bcrypt
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport,user){

var User = user; // required for sequelize - treat user as a global class
var LocalStrategy = require('passport-local').Strategy;


passport.serializeUser(function(user, done) {
	done(null, user.id);
});


/* Deserializes user - used for persistent sessions */
passport.deserializeUser(function(id, done) {
	User.findById(id).then(function(user) {
		if(user)
			done(null, user.get());
		else
			done(user.errors, null);
	});
});

/* LOCAL SIGNUP */
passport.use('local-signup', new LocalStrategy({
	//Override regular required fields
	usernameField : 'email',
	passwordField : 'password',
	passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, email, password, done){
//encrypts password
var generateHash = function(password) {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};

//If sequelize finds matching email in DB ...
User.findOne({where: {email:email}}).then(function(user){
	if (user) {
		console.log("EMAIL TAKEN");
		return done(null, false, {message : 'That email is already taken'} );
	}
	else
	{
		var userPassword = generateHash(password);
		var data =
			{ email: email,
		  	password: userPassword,
		  	firstname: req.body.firstname,
		  	lastname: req.body.lastname
		};
		console.log("TEEEEEEEEEEST");
		console.log(JSON.stringify(data));
		//Creates a new entry in the database
		User.create(data).then(function(newUser,created){
			if (!newUser) {
				return done(null, false);
			}
			if(newUser) {
				return done(null, newUser);
			}
		});
	}
});
}
));

/* LOCAL SIGNIN */
passport.use('local-signin', new LocalStrategy(
{
	// by default, local strategy uses username and password, we will override with email
	usernameField : 'email',
	passwordField : 'password',
	passReqToCallback : true // allows us to pass back the entire request to the callback
},

function(req, email, password, done) {
	var isValidPassword = function(userpass, password) {
		return bCrypt.compareSync(password, userpass);
	}
	//If sequelize finds matching email in DB ...
	User.findOne({ where : { email: email }}).then(function (user) {
		if (!user) {
			console.log ("WRONG EMAIL");
			return done(null, false, { message: 'Email does not exist' });
		}
		if (!isValidPassword(user.password, password)) {
			console.log ("WRONG PASSWORD");
	  		return done(null, false, { message: 'Incorrect password.' });
		}
		var userinfo = user.get();
		console.log ("SUCCESSFUL LOGIN:")
		console.log (JSON.stringify(userinfo));
		return done(null,userinfo);
  	}).catch(function(err){
		console.log("Error:",err);
		return done(null, false, { message: 'Something went wrong with your Signin' });
  	});
}
));
}
