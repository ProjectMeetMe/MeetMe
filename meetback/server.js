var express = require('express');
var mysql = require ('mysql')

app = express();
port = process.env.PORT || 2990;

app.listen(port);

console.log('RESTful API server started on: ' + port);

var dbConnection = mysql.createConnection({
  host: "104.42.79.90",
  user: "cpen321",
  password: "Test8as_",
  database: "CPEN321"
});

//Testing DB:
dbConnection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...')
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
