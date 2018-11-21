var db = require("../models/sequelize.js");
var bCrypt = require("bcrypt-nodejs");


exports.resetPassword = function(req, res, next) {
	var oldPass = req.body.oldPass;
	var newPass = req.body.newPass;
	var confirmPass = req.body.confirmPass;


};
