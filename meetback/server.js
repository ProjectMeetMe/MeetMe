var express = require('express');
var mysql = require ('mysql');
var passport = require ('passport');
var session = require ('express-session');
var bodyParser = require ('body-parser');
var cookieParser = require ('cookie-parser');
var flash = require ('connect-flash');
var app = express();
port = process.env.PORT || 2990;

app.listen(port);

console.log('RESTful API server started on: ' + port);

app.use(session({ resave: false, saveUninitialized: false,
					secret: 'cookie' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
var passportConfig = require ('./config/authenticate.js')(passport);



app.post('/signup',
	passport.authenticate('signup', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

app.post('/login',
	passport.authenticate('login', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

app.get('/logout', (req, res)=>{
	req.logout();
	return res.json({status:'success'});
});

//Testing DB:
/*
var dbConnection = mysql.createConnection({
  host: "104.42.79.90",
  user: "cpen321",
  password: "Test8as_",
  database: "CPEN321"
});

dbConnection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...');
})
*/

//Create table
/*
dbConnection.query('CREATE TABLE users(`id` int(11) NOT NULL AUTO_INCREMENT, `email` varchar(100) NOT NULL, `password` varchar(60) NOT NULL, PRIMARY KEY (id))', function(err, result) {
	if (err) throw err
})
*/

//Test insert
/*
email = "Test@456.ca";
password = "testz";
dbConnection.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], function(err, result) {
  if (err) throw err
});*/
