const Sequelize = require("sequelize");

const dbUser = "cpen321";
const dbPassword = "Test8as_";
const dbName = "CPEN321";
const dbHost = "104.42.79.90";
const dbDialect = "mysql";
const Op = Sequelize.Op;

//Connect to mysql database
const sequelize = new Sequelize(dbName, dbUser, dbPassword, { //database username password
    host: dbHost,
    dialect: dbDialect,
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
db.user = require("./user.js")(sequelize, Sequelize);
db.group = require("./group.js")(sequelize, Sequelize);
db.event = require("./event.js")(sequelize, Sequelize);

//Defined relations
//Many to many relation between group and users
db.user.belongsToMany(db.group, {
    through: "group_users"
});
db.group.belongsToMany(db.user, {
    through: "group_users"
});

//One to many relation between groups and events
db.event.belongsTo(db.group);
db.group.hasMany(db.event, {
    as: "events"
});

//Sync models with database
sequelize.sync(
        // Enable to reset database
        /*{
                force: true
            }*/
    )
    .then(() => {
        console.log("Database & tables synced with models!");
    });

module.exports = db;
