var Sequelize = require("sequelize");
const Op = Sequelize.Op;
var bCrypt = require("bcrypt-nodejs");
var jwt = require("jsonwebtoken");
var config = require("config");

var db = require("../models/sequelize.js");
var groupController = require("./group.js");

/* Middlewares for handling user related requests */

/*
Finds a list of the groups that the currently logged in user belongs to
List of groups only include their group and groupName
 */
exports.getGroups = function(req, res, next) {
    db.user.findOne({
        include: [{
            model: db.group,
            attributes: ["id", "groupName"], //elements of the group that we want
            through: {
                attributes: []
            }
        }],
        where: {
            id: req.user.id //user must belong to group
        }
    }).then(function(userWithGroups) {
        var groups = userWithGroups.groups;
        return res.status(200).json({
            groups,
            message: "Successful group retrieval"
        }); //only return group info
    }).catch(function(err) {
        return res.status(400).json({
            message: "Error: Groups could not be retrieved"
        });
    });
};

/*
Edits the user schedule specified by req.body.schedule
 */
exports.editSchedule = function(req, res, next) {
    //TODO: should confirm that req.body.schedule is in correct format

    db.user.update({
        //schedule: JSON.parse(req.body.schedule)
		schedule: req.body.schedule
	}, {
        where: {
            id: req.user.id
        }
    }).then(function(updatedUser) {
        if (!updatedUser) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        } else {
            return res.status(200).json({
                message: "Successful schedule update"
            });
        }
    }).catch(function(err) {
        return res.status(400).json({
            message: "Some error occured",
            error: err
        });
    });
};

/*
Gets events from all the groups this user belongs to
 */
exports.getEvents = function(req, res, next) {

    db.user.findOne({
        include: [{
            model: db.group,
            attributes: ["id", "groupName"], //elements of the group that we want
            through: {
                attributes: []
            }
        }],
        where: {
            id: req.user.id //user must belong to group
        }
    }).then(function(userWithGroups) {
        //construct groupid array
        var groups = [];
		var groupNames = {};
        for (var i = 0; i < userWithGroups.groups.length; i++) {
            groups.push(userWithGroups.groups[i].id);
			groupNames[userWithGroups.groups[i].id] = userWithGroups.groups[i].groupName;
        }

        db.event.findAll({
            where: {
                groupId: {
                    [Op.or]: groups //All events that belong to groupIds in groups
                }
            },
            raw: true
        }).then(function(events) {

			//add a group name field to each event:
			for (var i=0; i<events.length; i++){
				var groupId = events[i].groupId;
				events[i]["groupName"] = groupNames[groupId];
			}

            events = groupController.sortEvents(events);

            return res.status(200).json({
                events,
                message: "Successful events retrieval"
            });
        }).catch(function(err) {
            return res.status(400).json({
                message: "Error: Events could not be found"
            });
        });
    }).catch(function(err) {
        return res.status(400).json({
            message: "Error: User could not be found"
        });
    });

}

exports.changePassword = function(req, res, next) {
	var oldPass = req.body.oldPass;
	var newPass = req.body.newPass;
	var confirmPass = req.body.confirmPass;

	if (!oldPass){
		return res.status(400).json({
			message: "Error: Old password is required"
		});
	}
	if (newPass.length < 4) {
		return res.status(400).json({
			message: "Error: New password must be at least 4 characters"
		});
	}
	if (newPass !== confirmPass){ //new passwords don't match
		return res.status(400).json({
			message: "Error: New passwords do not match"
		});
	}

	db.user.findOne({
        where: {
            id: req.user.id //user must belong to group
        }
    }).then(function(user) {
		if (!user) { //no user found
			return res.status(400).json({
	            message: "Error: User does not exist"
	        });
		}
		if (!bCrypt.compareSync(oldPass, user.password)) { //user found but passwords dont match
			return res.status(400).json({
	            message: "Error: Old password is incorrect"
	        });
		}

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
				const token = jwt.sign(updatedUser, config.get("jwtSecret"), {expiresIn: "30d"});

	            return res.status(200).json({
					user: updatedUser,
					token: token,
	                message: "Successful password update"
	            });
	        }
	    }).catch(function(err) {
	        return res.status(400).json({
	            message: "Some error occured",
	            error: err
	        });
	    });

    }).catch(function(err) {
        return res.status(400).json({
            message: "Error: User could not be retrieved"
        });
    });
};
