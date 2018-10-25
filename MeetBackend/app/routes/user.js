var express = require('express');
var router = express.Router();
var db = require("../models/sequelize.js"); //includes all models

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('This is the root page');
});

/* GET user profile. */
router.get('/profile', function(req, res, next) {
    return res.status(200).json(req.user);
});

/* GET user profile. */
router.get('/logout', function(req, res, next) {
    //TODO: Should do something here to invalidate the current token, perhaps with a blacklist of token values
    //Entries in blacklist do not have to stay for more than one day (JSON token expiry)
    return res.status(200).json(req.user);
});

/* POST update user schedule */
router.put('/editSchedule', function(req, res, next) {
    var newSchedule = req.body.schedule;
    var curUser = req.user.id;
    db.user.update({
        schedule: newSchedule
    }, {
        where: {
            id: curUser
        }
    }).then(function(updatedUser) {
        if (!updatedUser)
            return res.status(400).json({
                message: "Invalid user ID"
            });
        else
            return res.status(200).json({
                message: "Successful schedule update"
            });
    }).catch(function(err){
		return res.status(400).json({
			message: "Some error occured",
			error: err
		})
	})
});

module.exports = router;
