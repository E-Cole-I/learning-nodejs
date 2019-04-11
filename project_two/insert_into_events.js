


var mysql = require("mysql");
var crypto = require('crypto');

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

  exports.eid = 'test'

  var rowToBeInserted = {
    event_id: exports.eid,
    event_name: 'test1',
    event_location: 'test_loc',
    event_day: 'Monday',
    event_start_time: 'anytime',
    event_end_time: 'anytime'
    };

  var sql = ``;
  con.query('INSERT tbl_events SET ?', rowToBeInserted, function(err, result) {
    if(err) {
      throw err;
    }
    console.log("Value inserted");
  });
});