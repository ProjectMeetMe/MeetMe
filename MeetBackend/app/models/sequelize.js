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
db.event = require('./event.js')(sequelize, Sequelize);

//Defined relations
//Many to many relation between group and users
db.user.belongsToMany(db.group, {
    through: 'group_users'
});
db.group.belongsToMany(db.user, {
    through: 'group_users'
});

//One to many relation between groups and events
db.event.belongsTo(db.group);
db.group.hasMany(db.event, {
    as: 'events'
});

//Sync models with database
sequelize.sync(
        // Enable to reset database
        /*{
                force: true
            }*/
    )
    .then(() => {
        console.log(`Database & tables synced with models!`);
    })

module.exports = db;
