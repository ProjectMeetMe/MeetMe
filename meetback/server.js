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

var dbConnection = mysql.createConnection({
  host: "104.42.79.90",
  user: "cpen321",
  password: "Test8as_",
  database: "CPEN321"
});

dbConnection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...');

/*
ageX=41;
  dbConnection.query("SELECT * FROM people where age = (?)", [ageX], function(err, rows){
	  console.log(rows[0]);
  });*/

email = "test@123.ca";
password = "test";
id = 123;
  //var insertQuery = '"INSERT INTO users ( email, password, id ) values (?, ?, ?)", [email, password, id]';
  //console.log(insertQuery);

dbConnection.query('INSERT INTO users ( id, email, password ) VALUES (?, ?, ?)', [id, email, password], function(err, result){
	console.log("Query result: " + result);
	//return done(null, newUser);
});


/*
  dbConnection.query('CREATE TABLE people(id int primary key, name varchar(255), age int, address text)', function(err, result) {
    if (err) throw err
    dbConnection.query('INSERT INTO people (id, name, age, address) VALUES (?, ?, ?, ?)', ['1', 'Larry', '41', 'California, USA'], function(err, result) {
      if (err) throw err
      dbConnection.query('SELECT * FROM people', function(err, results) {
        if (err) throw err
        console.log(results[0].id)
        console.log(results[0].name)
        console.log(results[0].age)
        console.log(results[0].address)
      })
  })
})*/


})
