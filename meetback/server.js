var express = require('express'),
  app = express(),
  port = process.env.PORT || 2990;

app.listen(port);

console.log('RESTful API server started on: ' + port);