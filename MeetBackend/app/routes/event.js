var express = require('express');
var router = express.Router();
var db = require("../models/sequelize.js"); //user model

/* GET events for some group*/
router.get('/getEvents', function(req, res, next) {
    var curUserId = req.user.id;
	var targetGroupId = req.query.groupId;

    db.group.findOne({
        where: {
            id: targetGroupId
        }
    }).then(function(groupFound) {
		if (!groupFound){ //Could not find target group
			return res.status(400).json({
				message: "Error: Target group ID invalid"
			});
		}
		groupFound.getEvents().then(function(eventsInGroup){
			var events = {}
			events = eventsInGroup;
			return res.status(200).json({
				events,
				message: "Successful event retrieval"
			}); //only return group info
		})
    })
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

//TODO: PUT to edit events

//TODO: DELETE to remove events

module.exports = router;
