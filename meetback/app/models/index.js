"use strict";

//This file is used to import all the models we place in the models folder, and export them
//Models are like object declarations that automatically sync with the database

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development";
var db_config = require(path.join(__dirname, '..', 'config', 'database_config.json'))[env]; //loads database login info
var sequelize = new Sequelize(db_config.database, db_config.username, db_config.password, db_config);
var db = {};


fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});


db.sequelize = sequelize;

module.exports = db;
