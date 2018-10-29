var express = require("express");
var router = express.Router();
var db = require("../models/sequelize.js"); //includes all models

var groupController = require("../controllers/group.js");
var userController = require("../controllers/user.js");
var eventController = require("../controllers/event.js");

/* POST new group */
//Request body: {groupName: <string>}
router.post("/createGroup", groupController.createGroup, groupController.addUser);

/* PUT (edit) existing group info (currently can only change group name) */
//Request header: {groupId: <int>}, body: {groupName: <string>}
router.put("/editGroup", groupController.findGroup, groupController.checkPermissions, groupController.editGroup);

/* GET information for one group, including users */
//Request header: {groupId: <int>}
router.get("/getGroupInfo", groupController.findGroup, groupController.checkMembership, groupController.getGroupInfo);

/* POST join logged in user to group by groupId */
//Request header: {groupId: <int>}
router.post("/joinGroup", groupController.findGroup, groupController.checkGroupJoinable, groupController.addUser);

/* PUT request to leave group by groupId */
//Request header: {groupId: <int>}
router.post("/leaveGroup", groupController.findGroup, groupController.checkMembership, groupController.leaveGroup);

/* PUT request to remove group member */
//Request header: {groupId: <int>}, body: {userId: <int>}
router.put("/removeMember", groupController.findGroup, groupController.checkPermissions, groupController.removeUser);

/* GET events for some group*/
//Request header: {groupId: <int>}
router.get("/getEvents", groupController.findGroup, groupController.checkMembership, groupController.getEvents);



/////Work in progress:

/* GET optimal availibilties for all users in group*/
router.get("/getAvailabilities", groupController.findGroup, groupController.checkMembership, groupController.calculateAvailabilities);



module.exports = router;
