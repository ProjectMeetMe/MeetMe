var db = require("../models/sequelize.js");
const nodemailer = require('nodemailer');

exports.forgotPassword = function(req, res, next) {

	// Generate test SMTP service account from ethereal.email
	// Only needed if you don't have a real mail account for testing
	nodemailer.createTestAccount((err, account) => {
	    // create reusable transporter object using the default SMTP transport
	    var transporter = nodemailer.createTransport({
	        host: 'smtp.ethereal.email',
	        port: 587,
	        secure: false, // true for 465, false for other ports
	        auth: {
	            user: account.user, // generated ethereal user
	            pass: account.pass // generated ethereal password
	        }
	    });

	    // setup email data with unicode symbols
	    var mailOptions = {
	        from: '"Fred Foo 👻" <foo@example.com>', // sender address
	        to: 'williamgu2011@hotmail.com', // list of receivers
	        subject: 'Hello ✔', // Subject line
	        text: 'Hello world?', // plain text body
	        html: '<b>Hello world?</b>' // html body
	    };

	    // send mail with defined transport object
	    transporter.sendMail(mailOptions, (error, info) => {
	        if (error) {
	            return console.log(error);
	        }
	        console.log('Message sent: %s', info.messageId);
	        // Preview only available when sending through an Ethereal account
	        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

	        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
	        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
	    });
	});

	return res.status(200).json({
		message: "PLACEHOLDER FOR TESTING"
	});


}
