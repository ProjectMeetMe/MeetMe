var express = require('express');
var router = express.Router();
var models = require("../models/sequelize.js"); //user model
var User = models.User;
var Group = models.Group;

/* POST new group */
router.post('/createGroup', function(req, res, next) {

    Group.create({
        groupName: req.body.groupName,
        leaderId: req.user.id, //current logged in user's id
        groupMembers: [{
            id: req.user.id
        }]
    }, {
        include: [{
            model: User,
            as: 'groupMembers'
        }]

    }).then(function(newgroup, created) {

        return res.status(200).json(newgroup.get());
    });

})

/* POST join group */
router.post('/joinGroup', function(req, res, next) {

    const groupId = req.body.groupId

    Group.findOne({
        where: {
            id: groupId
        }
    }).then(function(group_found, created) {
        if (!group_found) {
            return res.status(400).json({
                message: "Invalid group id - does not exist"
            });
        }
        //add members to group
    });
})

module.exports = router;
