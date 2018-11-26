var express = require("express");
var router = express.Router();
var db = require("../models/sequelize.js");

var groupController = require("../controllers/group.js");
var userController = require("../controllers/user.js");
var eventController = require("../controllers/event.js");

/* GET users listing. */
router.get("/", function(req, res, next) {
    res.send("This is the root page");
});

/* GET user profile. */
router.get("/profile", userController.getProfile);

/* GET user profile. */
router.post("/logout", userController.logout);

/* GET groups that curr user belongs to */
router.get("/getGroups", userController.getGroups);

/* POST update user schedule */
//Body header: {schedule: <JSON object>}
router.put("/editSchedule", userController.editSchedule);

/* GET sorted events for all groups that user belongs to */
router.get("/getEvents", userController.getEvents);

/* POST for changing password, confirm pass should == new pass */
//Body: {oldPass: <string>, newPass: <string>, confirmPass: <string>}
router.post("/changePassword", userController.changePassword, userController.updateDBPass);


module.exports = router;
