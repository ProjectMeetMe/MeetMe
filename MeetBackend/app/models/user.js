//Defines a user object

module.exports = function(sequelize, Sequelize) {

    var User = sequelize.define('user', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        firstname: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        lastname: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastLogin: {
            type: Sequelize.DATE
        },
		//JSON object represents individual user schedules (for one week),
		//frontend needs to ensure this is correctly formatted
        schedule: {
            type: Sequelize.JSON
        }
    });

    return User;
}
