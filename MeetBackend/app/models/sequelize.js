const Sequelize = require('sequelize')
const userModel = require('./user.js')
const groupModel = require('./group.js')
const Op = Sequelize.Op;

const db_user = "cpen321";
const db_password = "Test8as_";
const db_name = "CPEN321";
const db_host = "104.42.79.90";
const db_dialect = "mysql";

//Connect to mysql database
const sequelize = new Sequelize(db_name, db_user, db_password, { //database username password
    host: db_host,
    dialect: db_dialect,
	operatorsAliases: Op, //suppress warnings
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

//Defined models
const user = userModel(sequelize, Sequelize);
const group = groupModel(sequelize, Sequelize);

//Sync models with database
sequelize.sync()
    .then(() => {
        console.log(`Database & tables synced with models!`);
    })

module.exports = {
    user,
    group
}
