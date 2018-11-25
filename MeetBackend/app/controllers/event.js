var db = require("../models/sequelize.js");
var notificationController = require("../controllers/notification.js");

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

		//Send notifications to each user in the group that an event was created
		var notificationDescription = "A new event, \"" + newEventInfo.eventName + "\" was created in \"" + req.groupInfo.groupName +"\"" ;
		var userIds = req.groupInfo.users;
		var promises = [];
		for (var i=0; i<userIds.length; i++) {
			promises.push(notificationController.addNotification(userIds[i].id, notificationDescription, req.user.id))
		}

		//Waits for all notifications to be added
		Promise.all(promises).then(function(){
			return res.status(200).json({
	            newEventInfo,
	            message: "Successful event add"
	        });
		}).catch(function(err){
			return res.status(200).json({
				newEventInfo,
				message: "Successful event add, notification error"
			});
		})
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
};


/*
Edits an event specified by req.event for generic users
Edit parameters are in req.body {description}
 */
exports.editEventDescription = function(req, res, next) {
    var event = req.event;
    event.update({
        description: req.body.description,
    }).then(function(updatedEvent) {
		console.log("new event info: " + JSON.stringify(newEventInfo))
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
};


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
			db.group.findOne({ //Find associated group + users in group
		        include: [{
		            model: db.user,
		            attributes: ["id", "firstname", "lastname", "email", "schedule"], //elements of the group that we want
		            through: {
		                attributes: []
		            }
		        }],
		        where: {
		            id: eventFound.groupId
		        }
		    }).then(function(groupFound) {
		        if (!groupFound) {
		            return res.status(400).json({
		                message: "Error: Associated group could not be found"
		            });
		        } else {
					req.event = eventFound;
		            req.group = groupFound; //Can directly perform db operations
		            req.groupInfo = groupFound.get(); //Only contains info
		            next();
		        }
		    })
        }
    }).catch(function(err) {
        return res.status(400).json({
            message: "Error: Event could not be found"
        });
    });
}
