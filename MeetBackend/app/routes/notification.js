var express = require("express");
var router = express.Router();
var db = require("../models/sequelize.js");

var notificationController = require("../controllers/notification.js");

/* GET notifications for user associated with current json token */
router.get("/getNotifications", notificationController.getNotifications);


module.exports = router;
