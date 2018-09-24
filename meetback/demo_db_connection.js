var mysql = require('mysql');

var con = mysql.createConnection({
  host: "104.42.79.90",
  user: "root",
  password: "mysqlDatabase"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});