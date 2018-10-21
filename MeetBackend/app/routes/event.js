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
        if (!groupFound) { //Could not find target group
            return res.status(400).json({
                events: [],
                message: "Error: Target group ID invalid"
            });
        }
        groupFound.getEvents().then(function(eventsInGroup) {
            var events = eventsInGroup;
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

/* PUT to edit events */
router.put('/editEvent', function(req, res, next) {
    //req must contain group ID + event ID
    var targetEventId = req.body.eventId
    var curUser = req.user.id;

    //change parameters:
    var newEventName = req.body.eventName;
    var newDescription = req.body.description;
    var newStartTime = req.body.startTime;
    var newEndTime = req.body.endTime;

    //Find event with corresponding event id
    db.event.findOne({
        where: {
            id: targetEventId
        }
    }).then(function(eventFound) {
        if (!eventFound) {
            return res.status(400).json({
                message: "Error: Invalid event id"
            });
        } else {
            eventFound.getGroup().then(function(group) {
                if (group.leaderId != curUser) {
                    return res.status(400).json({
                        message: "Error: Invalid permissions to add event"
                    });
                } else {
                    //Update event:
                    eventFound.update({
                        eventName: newEventName,
                        description: newDescription,
                        startTime: newStartTime,
                        endTime: newEndTime
                    }).then(function(updatedEvent) {
                        var newEventInfo = updatedEvent.get();
                        return res.status(200).json({
                            newEventInfo,
                            message: "Successful event update"
                        });
                    }).catch(function(err) {
                        return res.status(400).json({
                            message: "Error: Invalid event edit parameters"
                        });
                    });
                }
            })
        }
    })
})


/* PUT to edit events */
router.delete('/deleteEvent', function(req, res, next) {
    //req must contain group ID + event ID
    var targetEventId = req.body.eventId
    var curUser = req.user.id;

    //Find event with corresponding event id
    db.event.findOne({
        where: {
            id: targetEventId
        }
    }).then(function(eventFound) {
        if (!eventFound) {
            return res.status(400).json({
                message: "Error: Invalid event id"
            });
        } else {
            eventFound.getGroup().then(function(group) {
                if (group.leaderId != curUser) {
                    return res.status(400).json({
                        message: "Error: Invalid permissions to delete event"
                    });
                } else {
                    eventFound.destroy().then(function(deletedEventRecord) {                   return res.status(200).json({
                            deletedEventRecord,
                            message: "Successful event deletion"
                        });
                    }).catch(function(err) {
                        return res.status(400).json({
                            message: "Error: something went wrong"
                        });
                    });
                }
            })
        }
    })
})

module.exports = router;
