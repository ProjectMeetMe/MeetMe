var express = require("express");
var mysql = require("mysql");
var passport = require("passport");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var port = process.env.PORT || 2990;

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(passport.initialize());

//load passport strategies
require("./app/config/passport.js");

//Load routes
app.use("/auth", require("./app/routes/auth.js"));
//use authentication middleware for following routes:
app.use("/user", passport.authenticate("jwt", {session: false}), require("./app/routes/user.js"));
app.use("/group", passport.authenticate("jwt", {session: false}), require("./app/routes/group.js"));
app.use("/event", passport.authenticate("jwt", {session: false}), require("./app/routes/event.js"));


//Start server
app.listen(port, function() {
    console.log("RESTful API server listening on port: " + port);
});
