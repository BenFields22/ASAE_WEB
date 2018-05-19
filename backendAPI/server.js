var express = require('express');
var app = express();

var count = 0;
var saved = [];

// respond with "hello world" when a GET request is made to the homepage
app.get('/modelCount', function (req, res) {
  console.log("Call to back end to get count. Count: ",count);
  res.json({
  	id: 1,
  	Modelcount: count
  });
});

app.get('/AddView', function (req, res) {
  console.log("Adding to count. Count: ",count+1);
  count = count +1;
  res.json({
  	id: 1,
  	Modelcount: count
  });
});

app.listen(8080, () => console.log('Backend API listening on port 8080!'))