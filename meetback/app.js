var express = require('express');
var mysql = require('mysql');
var passport = require('passport');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var env = require('dotenv').load();
port = process.env.PORT || 2990;

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(passport.initialize());

//Models
var models = require("./app/models");

//Sync database with defined models
models.sequelize.sync().then(function() {
    console.log('Successful sync')
}).catch(function(err) {
    console.log(err, "Unsuccessful sync")
});

//load passport strategies
require('./app/config/passport.js');

//Route imports
var authRoutes = require('./app/routes/auth.js');
var userRoutes = require('./app/routes/user.js');

//Load routes
app.use('/auth', authRoutes);
app.use('/user', passport.authenticate('jwt', {session: false}), userRoutes); //use authentication middleware for user routes


//Start server
app.listen(port, function() {
    console.log('RESTful API server listening on port: ' + port);
});
