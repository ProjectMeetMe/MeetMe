var db = require("../models/sequelize.js");

exports.getNotifications = function(req, res, next) {

    //Retrieve 20 most recent notifications
    db.notification.findAll({
        limit: 20,
        where: {
            userId: req.user.id
        },
        order: [
            ["id", "DESC"]
        ]
    }).then(function(notifications) {

        notifications.forEach(function(notification) {
            notification.updateAttributes({
                seen: true
            });
        })
        return res.status(200).json({
            notifications,
            message: "Successful notification retrieval"
        });

    }).catch(function(err) {
        console.log(err)
        return res.status(400).json({
            message: "Error: could not retrieve notifications"
        })
    });


}

/*
Function to add a notification for user = userId
Return type is a promise that must be waited on
 */
exports.addNotification = function(userId, description, curUserId) {

    var seen;
    if (userId == curUserId) {
        seen = true;
    } else {
        seen = false;
    }

    var notification = {
        description: description,
        userId: userId,
        seen: seen
    }

    return db.notification.create(notification);

}
