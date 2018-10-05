//Defines a group object

module.exports = function(sequelize, Sequelize) {

    var Group = sequelize.define('group', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        groupName: {
            type: Sequelize.STRING,
            notEmpty: true
        },
		leaderId: {
			type: Sequelize.STRING,
            notEmpty: true
		}
    });
    return Group;
}
