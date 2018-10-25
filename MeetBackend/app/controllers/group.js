var db = require("../models/sequelize.js");

const MAX_GROUP_USERS = 10; // Max allowed users per group

/* Middlewares for handling group related requests */


/*
Edits a group specified by req.group
Group edit parameters are in req.body: (groupName)
 */
exports.editGroup = function(req, res, next) {
    var group = req.group;
    group.update({
        groupName: req.body.groupName
    }).then(function(updatedInfo) {
        return res.status(200).json({
            updatedInfo,
            message: "Successful group edit"
        });
    }).catch(function(err) {
        return res.status(400).json({
            message: "Error: Group could not be edited"
        });
    });
}

/*
Gets group info specified by req.group
Includes user info as well
 */
exports.getGroupInfo = function(req, res, next) {
    var groupInfo = req.groupInfo;
    return res.status(200).json({
        groupInfo,
        message: "Successful group retrieval"
    });
}

/*
Gets events from group specified by req.group
 */
exports.getEvents = function(req, res, next) {
    var group = req.group;
	group.getEvents().then(function(events) {
		//TODO: sort events by order
		return res.status(200).json({
			events,
			message: "Successful event retrieval"
		});
	}).catch(function(err){
		return res.status(400).json({
            message: "Error: Events could not be retrieved"
        });
	});
}


/*
Adds user specified by user token to target group instance specified by req.group
 */
exports.addUser = function(req, res, next) {
    var group = req.group;
    var groupInfo = group.get();
    var users = group.users; //users will be undefined if we are coming from a create group call

    //If we are explicitly calling join group, check that user is not already in group and that
    //max users has not been exceeded
    if (users !== null && users !== "undefined" && users !== undefined) {
        for (var i = 0; i < users.length; i++) {
            if (users[i].id === req.user.id) { //user already exists in group
                return res.status(400).json({
                    message: "Error: User already in group"
                });
            }
        }
        var numUsers = users.length;
        if (numUsers >= MAX_GROUP_USERS) {
            return res.status(400).json({
                message: "Error: Group is full and no more members can join"
            });
        }
    }

    group.addUser(req.user.id).then(function(newUser) {
        if (users !== null && users !== "undefined" && users !== undefined) { // Coming from member join
            return res.status(200).json({
                groupInfo,
                newUser,
                message: "Successful group member join"
            });
        } else {
            return res.status(200).json({
                groupInfo,
                newUser,
                message: "Successful group creation"
            });
        }
    }).catch(function(err) {
        return res.status(400).json({
            message: "Error: User could not be added to group"
        });
    });
}


/*
Removes target user specified by req.body.userId from target group instance specified by req.group
 */
exports.removeUser = function(req, res, next) {
    var group = req.group;

    group.removeUser(req.body.userId).then(function(success) {
        if (success) {
            return res.status(200).json({
                message: "Successful member remove"
            });
        } else {
            return res.status(400).json({
                message: "Error: User does not exist in group"
            });
        }
    }).catch(function(err) {
        return res.status(400).json({
            message: "Error: User could not be removed from group"
        });
    });
}



/* HELPER MIDDLEWARES THAT DO NOT RESOLVE A REQUEST, MUST BE USED WITH FUNCTIONS*/

/*
Creates a group specified by req.body.groupName
Attaches the created group instance to req.group
 */
exports.createGroup = function(req, res, next) {
    db.group.create({
        groupName: req.body.groupName,
        leaderId: req.user.id
    }).then(function(newGroup) {
        req.group = newGroup;
		req.groupInfo = newGroup.get();
        next();
    }).catch(function(err) {
        return res.status(400).json({
            message: "Error: Invalid group creation parameters"
        });
    });
}


/*
Finds a target group specified by req.query.groupId
If the group exists, attaches the found group instance to req.group
 */
exports.findGroup = function(req, res, next) {
    db.group.findOne({
        include: [{
            model: db.user,
            attributes: ["id", "firstname", "lastname", "email"], //elements of the group that we want
            through: {
                attributes: []
            }
        }],
        where: {
            id: req.query.groupId
        }
    }).then(function(groupFound) {
        if (!groupFound) {
            return res.status(400).json({
                message: "Error: Invalid group id"
            });
        } else {
            req.group = groupFound; //Can directly perform db operations
			req.groupInfo = groupFound.get(); //Only contains info
            next();
        }
    }).catch(function(err) {
        return res.status(400).json({
            message: "Error: Group could not be found"
        });
    });
}


/*
Authenticates the permissions of the current user (given by the user token)
in a target group specified by req.groupInfo
 */
exports.authenticatePermissions = function(req, res, next) {
    var groupInfo = req.groupInfo;
    if (req.user.id != groupInfo.leaderId) {
        return res.status(400).json({
            message: "Error: Invalid permissions edit group"
        });
    } else {
        next();
    }
}
