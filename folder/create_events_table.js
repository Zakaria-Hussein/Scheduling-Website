/*
TO DO:
-----
READ ALL COMMENTS AND REPLACE VALUES ACCORDINGLY
*/

var mysql = require("mysql12");

const con = mysql.createConnection({
  host: "schedule-db.cdkq4kcmus2l.us-east-1.rds.amazonaws.com",
  user: "admin",               // replace with the database user provided to you
  password: "Schedule20!",                  // replace with the database password provided to you
  database: "admin",           // replace with the database user provided to you
  port: 3306
});

con.connect(function(err) {
  if (err) {
    throw err;
  };
  console.log("Connected!");
    var sql = `CREATE TABLE tbl_events(event_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                         event_day VARCHAR(30),
                                         event_event VARCHAR(300),
                                         event_start VARCHAR(64),
                                         event_end VARCHAR(64),
                                         event_location VARCHAR(1024),
                                         event_phone VARCHAR(128),
                                         event_info VARCHAR(1024),
                                         event_url VARCHAR(1024))`;
  con.query(sql, function(err, result) {
    if(err) {
      throw err;
    }
    console.log("Table created");
        con.end();

  });
});
