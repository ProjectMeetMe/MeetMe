var db = require("../models/sequelize.js");

/* Middlewares for handling event related requests */

/*
Creates an event specified by params in req.body {eventName, description, startTime, endTime, groupId}
 */
exports.createEvent = function(req, res, next) {
    var event = {
        eventName: req.body.eventName,
        description: req.body.description,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        groupId: req.query.groupId
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
    });
};


/*
Edits an event specified by req.event.
Edit parameters are in req.body {eventName, description, startTime, endTime, groupId}
 */
exports.editEvent = function(req, res, next) {
    var event = req.event;
    event.update({
		eventName: req.body.eventName,
        description: req.body.description,
        startTime: req.body.startTime,
        endTime: req.body.endTime
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


/*
Deletes an event specified by req.event.
 */
exports.deleteEvent = function(req, res, next) {
	var event = req.event;
	event.destroy().then(function(deletedEventRecord) {
		return res.status(200).json({
			deletedEventRecord,
			message: "Successful event deletion"
		});
	}).catch(function(err) {
		return res.status(400).json({
			message: "Error: something went wrong with deletion"
		});
	});
}


/*
Finds an event specified by params in req.query.eventId
 */
exports.findEvent = function(req, res, next) {
    db.event.findOne({
        where: {
            id: req.query.eventId
        }
    }).then(function(eventFound) {
        if (!eventFound) {
            return res.status(400).json({
                message: "Error: Invalid event id"
            });
        } else {
            eventFound.getGroup().then(function(group){
				req.event = eventFound;
				req.groupInfo = group;
				next();
			});
        }
    }).catch(function(err) {
        return res.status(400).json({
            message: "Error: Event could not be found"
        });
    });
}
