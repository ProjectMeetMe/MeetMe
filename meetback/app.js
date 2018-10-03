var express = require('express');
var mysql = require('mysql');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var env = require('dotenv').load();
port = process.env.PORT || 2990;

var app = express();

app.use(session({
    secret: 'secret_name',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session()); // enables persistent login sessions

//Models
var models = require("./app/models");

//Route imports
var authRoutes = require('./app/routes/auth.js');
var userRoutes = require('./app/routes/user.js');

//load passport strategies
require('./app/config/passport.js')(passport, models.user);

//Sync database with defined models
models.sequelize.sync().then(function() {
    console.log('Successful sync')
}).catch(function(err) {
    console.log(err, "Unsuccessful sync")
});

//Start server
app.listen(port, function() {
    console.log('RESTful API server listening on port: ' + port);
});

//Load routes
app.use('/auth', authRoutes);
app.use('/user', passport.authenticate('jwt', {session: false}), userRoutes);
