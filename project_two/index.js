// YOU CAN USE THIS FILE AS REFERENCE FOR SERVER DEVELOPMENT

// include the express module
var express = require("express");

// create an express application
var app = express();

// helps in extracting the body portion of an incoming request stream
var bodyparser = require('body-parser');

// fs module - provides an API for interacting with the file system
var fs = require("fs");

// helps in managing user sessions
var session = require('express-session');

// native js function for hashing messages with the SHA-256 algorithm
var crypto = require('crypto');

// include the mysql module
var mysql = require("mysql");


// apply the body-parser middleware to all incoming requests
app.use(bodyparser());




function checkSignInStock(req, res){
  console.log("user", req.session.user);
   if(req.session.user){
          res.sendFile(__dirname + '/client/stock.html');
          
   } else {
      console.log('User is not logged in...')
      
      return res.redirect('/login');
   }
}


function checkSignInAdd(req, res){
  console.log("user", req.session.user);
   if(req.session.user){
          res.sendFile(__dirname + '/client/addSchedule.html');
          
   } else {
      console.log('User is not logged in...')
      
      return res.redirect('/login');
   }
}

function checkSignInSchedule(req, res){
  console.log("user", req.session.user);
   if(req.session.user){
          res.sendFile(__dirname + '/client/schedule.html');
          
   } else {
      console.log('User is not logged in...')
      return res.redirect('/login');
   }
}



function scheduler() {
   //Add Details

  var mysql = require("mysql");

  var con = mysql.createConnection({
    host: "cse-curly.cse.umn.edu",
    user: "C4131S19G103", // replace with the database user provided to you
    password: "10639", // replace with the database password provided to you
    database: "C4131S19G103", // replace with the database user provided to you
    port: 3306
  });

  con.connect(function(err) {
    if (err) {
      throw err;
    };
    console.log("Connected!");
    var sql = `SELECT * FROM tbl_events`;
    con.query(sql, function(err, result) {
      if(err) {
        throw err;
      }
      var table_contents = '';

      for (i=0; i < result.length; i++) {

        //Table entry for the schedule
        var table_entry = '<tr>' + '<td>' + result[i].event_name + '</td>'+ '<td>' 
            + result[i].event_location + '</td>' + '<td>' + result[i].event_day +'</td>' + '<td>' 
            + result[i].event_start_time + '</td>' + '<td>' + result[i].event_end_time + '</td>' + '</tr> ' + '\n';

        table_contents = table_contents.concat(table_entry);

      };
      // New html to overwrite the existing schedule pafe
      var content = '<html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"> <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script> <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script> </head> <body> <nav class="navbar navbar-default"> <div class="container-fluid"> <ul class="nav navbar-nav"> <li><a href="/"><b>Home</b></a></li> <li><a href="/login"><b>Login</b></a></li> <li><a href="/schedule"><b>Schedule</b></a></li> <li><a href="/addSchedule"><b>Add Schedule Event</b></a></li> <li><a href="/stock"><b>Stock Page</b></a></li> <li> <a href="/logout"><span class="glyphicon glyphicon-log-out"></span></a> </ul> </div> </nav><br><br><br> <br><br> <div class="container"> <table class="table" id="scheduleTable"> <thead> <tr> <th scope="col">Event Name</th> <th scope="col">Location</th> <th scope="col">Day of Week</th> <th scope="col">Start-Time</th> <th scope="col">End-Time</th> </tr> </thead> <tbody>' + table_contents + '</tbody> </table> </div> </body> </html>';

      // Overwrite the the schedule html
      fs.writeFile("./client/schedule.html", content, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    }); 

    });
  });
};

// use express-session
// in mremory session is sufficient for this assignment
app.use(session({
  secret: "csci4131secretkey",
  saveUninitialized: true,
  resave: false}
));

// server listens on port 9007 for incoming connections
app.listen(9007, () => console.log('Listening on port 9007!'));

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/welcome.html');
});



// GET method route for the addEvents page.
// It serves addSchedulehtml present in client folder
app.get('/addSchedule', checkSignInAdd, function(req, res) {
  //Add Details
  res.sendFile(__dirname + '/client/addSchedule.html');
});
//GET method for stock page
app.get('/stock', checkSignInStock, function (req, res) {
  res.sendFile(__dirname + '/client/stock.html');

});

// GET method route for the login page.
// It serves login.html present in client folder
app.get('/login',function(req, res) {
  //Add Details
  res.sendFile(__dirname + '/client/login.html');
});

// GET method to return the list of events
// The function queries the table events for the list of places and sends the response back to client
app.get('/schedule', checkSignInSchedule, function(req, res) {
  scheduler();
  res.sendFile(__dirname + '/client/schedule.html');
});


// POST method to insert details of a new event to tbl_events table
app.post('/postScheduleEntry', function(req, res, reqBody) {
  //Add Detail
  console.log('Add Event Body Post', req.body.eventName)
  
  var con = mysql.createConnection({
  host: "cse-curly.cse.umn.edu",
  user: "C4131S19G103", // replace with the database user provided to you
  password: "10639", // replace with the database password provided to you
  database: "C4131S19G103", // replace with the database user provided to you
  port: 3306
  });

  con.connect(function(err) {
    if (err) {
      throw err;
    };
    console.log("Connected!");

    // Rows to be inserted in the database for events
    var rowToBeInserted = {
                          event_id: 'This is automatically made',
                          event_name: req.body.eventName,
                          event_location: req.body.location,
                          event_day: req.body.date,
                          event_start_time: req.body.stime,
                          event_end_time: req.body.etime
                          };
                        

    var sql = ``;
    con.query('INSERT tbl_events SET ?', rowToBeInserted, function(err, result) {
      if(err) {
        throw err;
      }

    });

    // Runs my sheduler function from above which builds a new html page with the records from the database
    // Not the best solution for a prod environment, so sorry for the weirdness.
    scheduler();
    // I return a redirect here so it triggers my schedule case. 
    return res.redirect('/schedule');
  });

});


// POST method to validate user login
// upon successful login, user session is created
app.post('/sendLoginDetails', function(req, res, reqBody) {
  //Add Details
  var newUser = {uid: req.body.uid, password: req.body.password};
  var valid = 0;

  var con = mysql.createConnection({
    host: "cse-curly.cse.umn.edu",
    user: "C4131S19G103", // replace with the database user provided to you
    password: "10639", // replace with the database password provided to you
    database: "C4131S19G103", // replace with the database user provided to you
    port: 3306
  });

  con.connect(function(err) {
    if (err) {
      throw err;
    };
    console.log("Connected!");
    var sql = `SELECT * FROM tbl_accounts`;
    con.query(sql, function(err, result) {
      if(err) {
        throw err;
      }
      console.log("Table returned");

      for (i=0; i < result.length; i++) {
        console.log('result',i,result[i]);
        console.log('user', result[i].acc_login, 'password', result[i].acc_password)
        if (newUser.uid == result[i].acc_login && crypto.createHash('sha256').update(newUser.password).digest('base64') == result[i].acc_password) {
          valid += 1;
        };

      };


      if (valid > 0) {
        console.log("Logging in", newUser);
        req.session.user = newUser;
        
        res.sendFile(__dirname + '/client/schedule.html');
      } else {
        console.log('Oh no....');
        res.sendFile(__dirname + '/client/login_fail.html');
      };


    });
  });


});

// log out of the application
// destroy user session
app.get('/logout', function(req, res) {
  //Add Details
  req.session.destroy(function(){
      console.log("user logged out.")
   });
   res.redirect('/login');
   
});

// middle ware to serve static files
app.use('/client', express.static(__dirname + '/client'));


// function to return the 404 message and error to client
app.get('*', function(req, res) {
  // add details
  res.sendFile(__dirname + '/client/404.html');
});
