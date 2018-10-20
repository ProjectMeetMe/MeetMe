//Defines an event object

module.exports = function(sequelize, Sequelize) {

    var Event = sequelize.define('event', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        eventName: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        description: {
            type: Sequelize.TEXT,
            notEmpty: true
        },
        startTime: {
            type: Sequelize.DATE,
            notEmpty: true
        },
		endTime: {
			type: Sequelize.DATE,
			notEmpty: true
		},
		groupId: {
			type: Sequelize.INTEGER,
			notEmpty: true
		}
    });

    return Event;
}
