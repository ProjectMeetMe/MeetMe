var db = require("../models/sequelize.js");

/* Middlewares for handling user related requests */

/*
Finds a list of the groups that the currently logged in user belongs to
List of groups only include their group and groupName
 */
exports.getGroups = function(req, res, next) {
    db.user.findOne({
        include: [{
            model: db.group,
            attributes: ["id", "groupName"], //elements of the group that we want
            through: {
                attributes: []
            }
        }],
        where: {
            id: req.user.id //user must belong to group
        }
    }).then(function(userWithGroups) {
        var groups = userWithGroups.groups;
        return res.status(200).json({
            groups,
            message: "Successful group retrieval"
        }); //only return group info
    }).catch(function(err) {
        return res.status(400).json({
            message: "Error: Groups could not be retrieved"
        });
    });
};

/*
Edits the user schedule specified by req.body.schedule
 */
exports.editSchedule = function(req, res, next) {
    db.user.update({
        schedule: req.body.schedule
    }, {
        where: {
            id: req.user.id
        }
    }).then(function(updatedUser) {
        if (!updatedUser) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        } else {
            return res.status(200).json({
                message: "Successful schedule update"
            });
        }
    }).catch(function(err) {
        return res.status(400).json({
            message: "Some error occured",
            error: err
        });
    });
}
