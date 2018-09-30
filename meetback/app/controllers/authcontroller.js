var exports = module.exports = {}


exports.signup = function(req,res){
	res.send("SIGNUP PAGE");
}

exports.signin = function(req,res){
	res.send("SIGNIN PAGE");
}

exports.dashboard = function(req,res){
	res.send("DASHBOARD PAGE");
}

exports.logout = function(req,res){
	req.session.destroy(function(err) { //destroys current session and redirects to root
		console.log("SUCCESSFUL LOGOUT");
		res.redirect('/');
  	});
}
