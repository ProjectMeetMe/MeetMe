var express = require("express");
var router = express.Router();
var db = require("../models/sequelize.js"); //includes all models

var groupController = require("../controllers/group.js");
var userController = require("../controllers/user.js");
var eventController = require("../controllers/event.js");

/* GET users listing. */
router.get("/", function(req, res, next) {
    res.send("This is the root page");
});

/* GET user profile. */
router.get("/profile", function(req, res, next) {
    return res.status(200).json(req.user);
});

/* GET user profile. */
router.get("/logout", function(req, res, next) {
    //TODO: Should do something here to invalidate the current token, perhaps with a blacklist of token values
    //Entries in blacklist do not have to stay for more than one day (JSON token expiry)
    return res.status(200).json(req.user);
});

/* GET groups that curr user belongs to */
router.get("/getGroups", userController.getGroups);

/* POST update user schedule */
//Body header: {schedule: <JSON object>}
router.put("/editSchedule", userController.editSchedule);

module.exports = router;
