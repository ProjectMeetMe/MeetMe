var sequelizeTokenify = require("sequelize-tokenify");

//Defines a group object

module.exports = function(sequelize, Sequelize) {

    var Group = sequelize.define("group", {
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
        },
        joinToken: {
            type: Sequelize.STRING,
            notEmpty: true
        }
    });

    sequelizeTokenify.tokenify(Group, { //generates unique token for group for purposes of joining group
        field: "joinToken"
    });

    return Group;
}
