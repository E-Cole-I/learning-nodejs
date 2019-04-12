// include the express module
var express = require("express");

// create an express application
var app = express();

// helps in extracting the body portion of an incoming request stream
var bodyparser = require('body-parser');

// fs module - provides an API for interacting with the file system
var fs = require("fs");


// apply the body-parser middleware to all incoming requests
app.use(bodyparser());




// server listens on port 9007 for incoming connections
app.listen(9999, () => console.log('Listening on port 9999!'));

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});


app.get('/home',function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

app.get('/map',function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

app.get('/mapquery',function(req, res) {
  res.sendFile(__dirname + '/client/map.html');
});




// POST method to validate user login
// upon successful login, user session is created
app.post('/query', function(req, res, reqBody) {
  //Add Details
  console.log("You have enabled a Query and are a step closer!")
  console.log("Query", req.body);
  var query = JSON.parse(req.body.comment);
  console.log('json', query)


  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";
  var content = '';
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("gserve");

    dbo.collection("data").find(query).toArray(function(err, result) {
      if (err) throw err;
      console.log(result[0]);

      var content = 'var localData = { "type": "FeatureCollection", "features":' + JSON.stringify(result) + '}';
      fs.writeFile("./client/data/data.js", content, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
        res.sendFile(__dirname + '/client/map.html');
    }); 

      db.close();
    });
  });

});



// middle ware to serve static files
app.use('/client', express.static(__dirname + '/client'));


// function to return the 404 message and error to client
app.get('*', function(req, res) {
  // add details
  res.sendFile(__dirname + '/client/404.html');
});