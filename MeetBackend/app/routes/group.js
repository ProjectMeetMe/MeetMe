var express = require('express');
var router = express.Router();
var db = require("../models/sequelize.js"); //user model

const maxUsersInGroup = 10; // Max allowed users per group

/* POST new group */
router.post('/createGroup', function(req, res, next) {

    var curUserId = req.user.id; //current logged in user's id

    db.group.create({
        groupName: req.body.groupName,
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


/* GET user groups */
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
        var groups = {}
        groups.group = userWithGroups.groups;
        return res.status(200).json({
            groups,
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


/* POST add event */
router.post('/addEvent', function(req, res, next) {

    //req must contain group ID + event
    var targetGroupId = req.body.groupId
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
                message: "Error: Invalid permissions to add event"
            });
        } else {
            //Create the event
            var event = {
                eventName: req.body.eventName,
                description: req.body.description,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                groupId: req.body.groupId
            };
            db.event.create(event).then(function(newEvent) {
                var newEventInfo = newEvent.get();
                return res.status(200).json({
                    newEventInfo,
                    message: "Successful event add"
                });
            }).catch(function(err) {
                return res.status(400).json({
                    message: "Error: Invalid event creation parameters"
                });
            })
        }
    });
})

module.exports = router;
