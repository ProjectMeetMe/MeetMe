var express = require('express');
var router = express.Router();
var db = require("../models/sequelize.js"); //user model

/* POST new group */
router.post('/createGroup', function(req, res, next) {

    db.group.create({
        groupName: req.body.groupName,
        leaderId: req.user.id, //current logged in user's id
    }).then(function(newgroup) {
        newgroup.addUser(req.user.id); //adds the lead user to this group
        return res.status(200).json(newgroup.get());
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
    }).then(function(user_groups) {
        return res.status(200).json(user_groups.groups); //only return group info
    })
})


/* POST join logged in user to group */
router.post('/joinGroup', function(req, res, next) {

    const groupId = req.body.groupId

    db.group.findOne({
        where: {
            id: groupId
        }
    }).then(function(group_found) {
        if (!group_found) {
            return res.status(400).json({
                message: "Invalid group id - does not exist"
            });
        }
        group_found.addUser(req.user.id); //adds the user to this group
        return res.status(200).json(group_found.get());
    });
})

module.exports = router;
