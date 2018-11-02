var express = require("express");
var router = express.Router();
var db = require("../models/sequelize.js"); //user model

var groupController = require("../controllers/group.js");
var userController = require("../controllers/user.js");
var eventController = require("../controllers/event.js");

/* POST add event */
//Request header: {groupId: <int>}
//Body header: {eventName, description, startTime, endTime}
router.post("/addEvent", groupController.findGroup, groupController.checkPermissions, eventController.createEvent);

/* PUT to edit events */
//Request header: {eventId: <int>}
//Body header: {eventName, description, startTime, endTime}
router.put("/editEvent", eventController.findEvent, groupController.checkPermissions, eventController.editEvent);

/* DELETE to delete events */
//Request header: {eventId: <int>}
router.delete("/deleteEvent", eventController.findEvent, groupController.checkPermissions, eventController.deleteEvent);

module.exports = router;
