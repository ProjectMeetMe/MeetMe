var express = require('express');
var router = express.Router();
var db = require("../models/sequelize.js"); //user model

const maxUsersInGroup = 10; // Max allowed users per group

/* POST new group */
router.post('/createGroup', function(req, res, next) {

    db.group.create({
        groupName: req.body.groupName,
        leaderId: req.user.id, //current logged in user's id
    }).then(function(newGroup) {
        newGroup.addUser(req.user.id); //adds the lead user to this group
        return res.status(200).json(newGroup.get());
    })
})


/* GET user groups */
router.get('/getGroups', function(req, res, next) {
    console.log(req.user.id);

    db.user.findOne({
        include: [{
            model: db.group,
            attributes: ['id', 'groupName'], //elements of the group that we want
            through: {
                attributes: []
            }
        }],
        where: {
            id: req.user.id //user must belong to group
        }
    }).then(function(userWithGroups) {
		var groups = {}
		groups.group = userWithGroups.groups;
        return res.status(200).json(groups); //only return group info
    })
})


/* POST join logged in user to group by groupJoinToken */
router.post('/joinGroup', function(req, res, next) {

    const joinToken = req.body.groupJoinToken

    db.group.findOne({
        include: [{
            model: db.user,
            attributes: ['id'], //get user ids in that group
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
		if (groupFound.users == maxUsersInGroup){
			return res.status(400).json({
				message: "Error: Group already has maximum allowed number of users"
			});
		}

        groupFound.addUser(req.user.id); //adds the user to this group
        return res.status(200).json(groupFound.get()); //return with info about group
    });
})

module.exports = router;
