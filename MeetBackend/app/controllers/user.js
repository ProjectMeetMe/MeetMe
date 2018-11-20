var db = require("../models/sequelize.js");
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
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
