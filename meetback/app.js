var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Hello World');
}).listen(2990, "0.0.0.0");

console.log("waiting for requests...");