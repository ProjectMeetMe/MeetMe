//Defines a table of group-user relationships

module.exports = function(sequelize, Sequelize) {

    var GroupUser = sequelize.define('group_user', {
        groupid: {
            type: Sequelize.INTEGER,
			notEmpty: true
        },
        userid: {
			type: Sequelize.INTEGER,
            notEmpty: true
        }
    });
    return GroupUser;
}
