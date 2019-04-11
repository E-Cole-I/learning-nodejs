

var mysql = require("mysql");

var con = mysql.createConnection({
  host: "",
  user: "", 
  password: "", 
  database: "", 
  port: 3306
});

con.connect(function(err) {
  if (err) {
    throw err;
  };
  console.log("Connected!");
    var sql = `CREATE TABLE tbl_events(event_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                       event_name VARCHAR(30),
                                       event_location VARCHAR(30),
                                       event_day VARCHAR(30),
                                       event_start_time VARCHAR(30),
                                       event_end_time VARCHAR(30))`;
  con.query(sql, function(err, result) {
    if(err) {
      throw err;
    }
    console.log("Table created");
  });
});
