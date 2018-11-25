var db = require("../models/sequelize.js");
const nodemailer = require("nodemailer");
var config = require("config");
var bCrypt = require("bcrypt-nodejs");


function generatePass() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 8; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

exports.sendEmail = function(req, res, next) {

    var email = req.body.email;
    var newPass = generatePass();
	req.newPass = newPass;

    if (!email) {
        return res.status(400).json({
            message: "Error: email is required"
        });
    }

    db.user.findOne({
        where: {
            email: email
        }
    }).then(function(user) {
        if (!user) {
            return res.status(400).json({
                message: "Error: email does not belong to any account"
            });
        }
		req.user = user;
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don"t have a real mail account for testing
        nodemailer.createTestAccount((err, account) => {
            // create reusable transporter object using the default SMTP transport
            var transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: config.get("email.email"),
                    pass: config.get("email.password")
                }
            });

            //Should set a unique recovery stash and store it in the user db (using the supplied email)
            //and attach it to this email
            var mailOptions = {
                from: config.get("email.email"),
                to: email,
                subject: "Password reset for MeetMe App",
                text: "Your password has been successfully reset!\nYour new password is: " + newPass
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                    return res.status(400).json({
                        message: "Error: recovery email could not be sent"
                    });
                } else {
                    console.log("Email sent: " + info.response);
                    //Update the entry in the DB:
					//Successful email send
                    next();
                }
            });
        });
    })
}

exports.resetDBPass = function(req, res, next) {
	var newPass = req.newPass;
	var user = req.user;

	var encrypNewPass = bCrypt.hashSync(newPass, bCrypt.genSaltSync(10), null);
	user.update({ //Update entry in database
		password: encrypNewPass
	}).then(function(updatedUser) {
		if (!updatedUser) {
			return res.status(400).json({
				message: "Error: password could not be updated"
			});
		} else {
			var updatedUser = updatedUser.get();

			return res.status(200).json({
				message: "Successful password reset"
			});
		}
	}).catch(function(err) {
		return res.status(400).json({
			message: "Some error occured",
			error: err
		});
	});

}
