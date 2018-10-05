const Sequelize = require('sequelize')

const db_user = "cpen321";
const db_password = "Test8as_";
const db_name = "CPEN321";
const db_host = "104.42.79.90";
const db_dialect = "mysql";
const Op = Sequelize.Op;

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
const User = require('./user.js')(sequelize, Sequelize);
const Group = require('./group.js')(sequelize, Sequelize);

//Defined relations
//User.belongsTo(Group);
Group.hasMany(User, {as: 'groupMembers'});

//Sync models with database
sequelize.sync()
    .then(() => {
        console.log(`Database & tables synced with models!`);
    })

module.exports = {
    User,
    Group
}
