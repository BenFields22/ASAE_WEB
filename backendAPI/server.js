var express = require('express');
var app = express();

var count = 0;
var saved = [];

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", 
   "Origin, X-Requested-With, Content-Type, Accept"); 
   next(); 
  });

// respond with "hello world" when a GET request is made to the homepage
app.get('/modelCount', (req, res) => {
  console.log("Call to back end to get count. Count: ",count);
  const info = {
    id: 1,
  	Modelcount: count
  }
  res.json(info);
});

app.get('/AddView', (req, res) => {
  console.log("Adding to count. Count: ",count+1);
  count = count +1;
  const info = {
    id: 1,
  	Modelcount: count
  }
  res.header("Access-Control-Allow-Origin: *");
  res.json(info);
});

app.listen(8080, () => console.log('Backend API listening on port 8080!'))