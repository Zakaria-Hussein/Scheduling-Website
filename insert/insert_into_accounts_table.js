/*
TO DO:
-----
READ ALL COMMENTS AND REPLACE VALUES ACCORDINGLY
*/

const mysql = require("mysql12");
const bcrypt = require('bcrypt');

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

    const saltRounds = 10;
    const myPlaintextPassword = 'tango'; // replace with plaintext password chosen by you OR retain the same value
    const passwordHash = bcrypt.hashSync(myPlaintextPassword, saltRounds);

    const rowToBeInserted = {
        acc_name: 'charlie',            // replace with acc_name chosen by you OR retain the same value
        acc_login: 'charlie',           // replace with acc_login chosen by you OR retain the same value
        acc_password: passwordHash      
    };

    console.log("Attempting to insert record into tbl_accounts");
    dbCon.query('INSERT tbl_accounts SET ?', rowToBeInserted, function (err, result) {
        if (err) {
            throw err;
        }
        console.log("Table record inserted!");
    });

    dbCon.end();
});
