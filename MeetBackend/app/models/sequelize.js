var Sequelize = require("sequelize");
var config = require("config");

//Retrieve info from config file
var dbUser = config.get("dbConfig.user");
var dbPassword = config.get("dbConfig.password");
var dbName = config.get("dbConfig.name");
var dbHost = config.get("dbConfig.host");
var dbDialect = config.get("dbConfig.dialect");

//Connect to mysql database
var sequelize = new Sequelize(dbName, dbUser, dbPassword, { //database username password
    host: dbHost,
    dialect: dbDialect,
	useUTC: false,
	timezone: "-08:00",
    logging: false, //disables console messages
    operatorsAliases: false, //suppress warnings
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

var db = {};

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
);

module.exports = db;
