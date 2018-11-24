//Defines a notification object

module.exports = function(sequelize, Sequelize) {

    var Notification = sequelize.define("notification", {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        description: {
            type: Sequelize.TEXT,
            notEmpty: true
        }
    });

    return Notification;
};
