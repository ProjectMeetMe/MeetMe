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

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Defined models
db.user = require('./user.js')(sequelize, Sequelize);
db.group = require('./group.js')(sequelize, Sequelize);

//Defined relations
db.user.belongsToMany(db.group, {
    through: 'group_users'
});
db.group.belongsToMany(db.user, {
    through: 'group_users'
});

//Sync models with database
sequelize.sync()
    .then(() => {
        console.log(`Database & tables synced with models!`);
    })

module.exports = db;
