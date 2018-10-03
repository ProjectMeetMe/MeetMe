var authController = require('../controllers/authcontroller.js');

module.exports = function(app, passport) {

    app.get('/signup', authController.signup); //Calls authController.signup


    app.get('/signin', authController.signin); //Calls authController.signin


    app.post('/signup', function(req, res, next){
		//Custom callback
		passport.authenticate('local-signup', function(err, user, info){
			if (err) { return next(err); }

			if (!user) {
				return res.json({message: info.message}); //send relevant error message
			}
			return res.json({message: "Successful signup"}); //send user object, may not be necessary

		}) (req, res, next);
    });


    app.get('/dashboard', isLoggedIn, authController.dashboard);


    app.get('/logout', authController.logout);


	app.post('/signin', function(req, res, next){
		//Custom callback
		passport.authenticate('local-signin', function(err, user, info){
			if (err) { return next(err); }

			if (!user) {
				return res.json({message: info.message}); //send relevant error message
			}
			req.logIn(user, function(err) {
				if (err) {return next(err); }
				res.status(200); //success
				return res.redirect('/dashboard'); //send user object, may not be necessary
			});
		}) (req, res, next);
    });

    //middleware for checking if user is logged in
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/signin');
    }


}
