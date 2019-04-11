
const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');

http.createServer(function (req, res) {
  var q = url.parse(req.url, true);

  if(req.url === '/'){
    indexPage(req,res);
  }
  else if(req.url === '/index.html'){
    indexPage(req,res);
  }
  else if(req.url === '/schedule.html'){
    schedule(req,res);  //request for schedule page
  }
  else if (req.url === '/stock.html') {
      stockPage(req, res); //stock page request
  }
  else if(req.url === '/addSchedule.html'){
    addSchedule(req,res);  //Form request
  }
  else if(req.url === '/schedule.json'){
    getSchedule(req,res); //Ajax request from schedule page
  }
  // Next route will get the data from the form and process it
  else if(req.url === '/postScheduleEntry') { 
        var reqBody = '';
        // server starts receiving the form data
        req.on('data', function(data) {
          reqBody += data;


        });
        // server has received all the form data
        req.on('end', function() {
          addScheduleEntry(req, res, reqBody);
        });
  }
  else{
    res.writeHead(404, {'Content-Type': 'text/html'});
    return res.end("404 Not Found");
  }
}).listen(9001);


function indexPage(req, res) {
  fs.readFile('client/index.html', function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}

function stockPage(req, res) {
    fs.readFile('client/stock.html', function (err, html) {
        if (err) {
            throw err;
        }
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        res.write(html);
        res.end();
    });
}

function schedule(req, res) {
  fs.readFile('client/schedule.html', function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}
function addSchedule(req, res) {
  console.log("In Add Schedule");
  fs.readFile('client/addSchedule.html', function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}
function getSchedule(req, res) {
  // Read the json file
   fs.readFile('schedule.json', function(err, html) {
    if(err) {
      throw err;
    }
    // Send the status code with an updated content type
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.write(html);
    res.end();
  });
  }

function addScheduleEntry(req, res, reqBody) {
 //Split the request from post
 var reqlist = reqBody.split('&');
 var json_obj = '{'

 for(var i = 0; i < reqlist.length; i++) {
  // Loop through and split each item and add it to a json string
  var event = reqlist[i].split('=');
  var eventName = event[0];
  var eventValue = event[1].replace('%3A',':');
  
  //Avoid adding a , at the last item bc it causes an error
  if (i==4) {
    var json_obj = json_obj + '"' + eventName + '"' + ': ' + '"' + eventValue + '"';

  }

  else{
    var json_obj = json_obj + '"' + eventName + '"' + ': ' + '"' + eventValue + '"' + ', ';
   };
 };

 // Close the string and parse it as a JSON Object
 var json_obj = json_obj + '}'
 var json_obj = JSON.parse(json_obj);

 // Read the JSON scheudle
 fs.readFile('schedule.json', function (err, data) {
    
    // Parse the JSON schedule
    var json = JSON.parse(data);

    // Push the new event to the JSON Object
    json.schedule.push(json_obj);

    // Rewrite the JSON schedule file with new item
    fs.writeFile("schedule.json", JSON.stringify(json), function(err, result) {
     if(err) console.log('error', err);
   });
});

 // Redirect the client to the updated schedule page
 fs.readFile('client/schedule.html', function(err, html) {
    if(err) {
      throw err;
    }

    // Redirect status code
    res.statusCode = 302;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}
