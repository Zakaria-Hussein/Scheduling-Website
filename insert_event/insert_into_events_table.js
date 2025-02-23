/*
TO DO:
-----
READ ALL COMMENTS AND REPLACE VALUES ACCORDINGLY
*/

const mysql = require("mysql12");

const dbCon = mysql.createConnection({
    host: "schedule-db.cdkq4kcmus2l.us-east-1.rds.amazonaws.com",
    user: "admin",               // replace with the database user provided to you
    password: "Schedule20!",                  // replace with the database password provided to you
    database: "admin",           // replace with the database user provided to you
    port: 3306
});

console.log("Attempting database connection");
dbCon.connect(function (err) {
    if (err) {
        throw err;
    }

    console.log("Connected to database!");

    const rowToBeInserted = {
        event_day: 'monday',
        event_event: 'A test event',
        event_start: '1:00 pm',
        event_end: '2:00 pm',
        event_location : 'my house',
        event_phone: '612-222-3333',
        event_info: 'A nice Lunch',
        event_url: ' https://campusclubumn.org/'
        };

    console.log("Attempting to insert record into tbl_accounts");
    dbCon.query('INSERT tbl_events SET ?', rowToBeInserted, function (err, result) {
        if (err) {
            throw err;
        }
        console.log("Table record inserted!");
    });

    dbCon.end();
});