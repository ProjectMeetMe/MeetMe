var express = require('express');
var router = express.Router();
var db = require("../models/sequelize.js"); //user model

const maxUsersInGroup = 10; // Max allowed users per group

/* POST new group */
router.post('/createGroup', function(req, res, next) {

    var curUserId = req.user.id; //current logged in user's id
    var groupName = req.body.groupName;

    db.group.create({
        groupName: groupName,
        leaderId: curUserId,
    }).then(function(newGroup) {
        newGroup.addUser(curUserId);
        var newGroupInfo = newGroup.get();
        return res.status(200).json({
            newGroupInfo,
            message: "Successful group creation"
        });
    }).catch(function(err) {
        return res.status(400).json({
            message: "Error: Invalid group creation parameters"
        });
    })
})


/* PUT (edit) existing group info (currently can only change group name) */
router.put('/editGroup', function(req, res, next) {
    //req must contain group ID + event
    var targetGroupId = req.body.groupId;
    var newGroupName = req.body.groupName;
    var curUser = req.user.id;

    //Find group with corresponding group id
    db.group.findOne({
        where: {
            id: targetGroupId
        }
    }).then(function(groupFound) {
        if (!groupFound) {
            return res.status(400).json({
                message: "Error: Invalid group id"
            });
        }
        //verify that curr user is leader
        else if (curUser != groupFound.leaderId) {
            return res.status(400).json({
                message: "Error: Invalid permissions edit group"
            });
        } else {
            groupFound.update({ //this executes but goes to catch anyways
                groupName: newGroupName
            }).then(function(updatedGroup) {
                var newGroupInfo = updatedGroup.get();
                return res.status(200).json({
                    newGroupInfo,
                    message: "Successful group name change"
                });
            }).catch(function(err) {
                return res.status(400).json({
                    message: "Error: Invalid group edit parameters"
                });
            });
        }
    });
})


/* PUT request to remove group member */
//TODO: Needs testing
router.put('/removeMember', function(req, res, next) {
    //req must contain group ID + event
    var targetGroupId = req.body.groupId
    var targetUserId = req.body.userId;
    var curUser = req.user.id;

    if (targetUserId == curUser) {
        return res.status(400).json({
            message: "Error: Cannot remove self"
        });
    }

    //Find group with corresponding group id
    db.group.findOne({
        where: {
            id: targetGroupId
        }
    }).then(function(groupFound) {
        if (!groupFound) {
            return res.status(400).json({
                message: "Error: Invalid group id"
            });
        }
        //verify that curr user is leader
        else if (curUser != groupFound.leaderId) {
            return res.status(400).json({
                message: "Error: Invalid permissions to add event"
            });
        } else {
            groupFound.removeUser(targetUserId);
            var groupInfo = groupFound.get();
            return res.status(200).json({
                groupInfo,
                message: "Successful member remove"
            });
        }
    });
})


/* GET groups that curr user belongs to */
router.get('/getGroups', function(req, res, next) {
    var curUserId = req.user.id;

    db.user.findOne({
        include: [{
            model: db.group,
            attributes: ['id', 'groupName'], //elements of the group that we want
            through: {
                attributes: []
            }
        }],
        where: {
            id: curUserId //user must belong to group
        }
    }).then(function(userWithGroups) {
        var groups = userWithGroups.groups;
        return res.status(200).json({
            groups,
            message: "Successful group retrieval"
        }); //only return group info
    })
})


/* GET users in group */
router.get('/getUsersInGroup', function(req, res, next) {
    var targetGroupId = req.query.groupId;
    db.group.findOne({
        include: [{
            model: db.user,
            attributes: ['id', 'firstname', 'lastname', 'email'], //elements of the group that we want
            through: {
                attributes: []
            }
        }],
        where: {
            id: targetGroupId //user must belong to group
        }
    }).then(function(groupWithUsers) {
		if (!groupWithUsers){
			return res.status(400).json({
				message: "Error: Invalid target group ID"
			});
		}
        return res.status(200).json({
            groupWithUsers,
            message: "Successful group retrieval"
        }); //only return group info
    })
})


/* POST join logged in user to group by groupJoinToken */
router.post('/joinGroup', function(req, res, next) {

    //req must contain group join token
    const joinToken = req.body.groupJoinToken;
    var curUserId = req.user.id;

    //Find group with corresponding group token
    db.group.findOne({
        include: [{ //attach user ids in that group
            model: db.user,
            attributes: ['id'],
            through: {
                attributes: []
            }
        }],
        where: {
            joinToken: joinToken
        }
    }).then(function(groupFound) {
        if (!groupFound) {
            return res.status(400).json({
                message: "Error: Invalid group join token"
            });
        }
        //Need to check that user is not currently in group
        //Set a limit on # members / group here?
        const usersInGroup = groupFound.users;
        for (var i = 0; i < usersInGroup.length; i++) {
            if (usersInGroup[i].id == req.user.id) { //user already exists in group
                return res.status(400).json({
                    message: "Error: User already in group"
                });
            }
        }
        if (usersInGroup.length == maxUsersInGroup) {
            return res.status(400).json({
                message: "Error: Group already has maximum allowed number of users"
            });
        }
        groupFound.addUser(curUserId); //adds the user to this group
        var joinedGroupInfo = groupFound.get();
        return res.status(200).json({
            joinedGroupInfo,
            message: "Successful group join"
        }); //return with info about group
    });
})

module.exports = router;
