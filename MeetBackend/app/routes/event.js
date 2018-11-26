var express = require("express");
var router = express.Router();
var db = require("../models/sequelize.js"); 

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

/* PUT to edit event description (only)*/
//Request header: {eventId: <int>}
//Body header: {description}
router.put("/editEventDescription", eventController.findEvent, groupController.checkMembership, eventController.editEventDescription);

module.exports = router;
