//Defines a group object

module.exports = function(sequelize, Sequelize) {

    var Group = sequelize.define('group', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        groupname: {
            type: Sequelize.STRING,
            notEmpty: true
        }
    });
    return Group;
}
