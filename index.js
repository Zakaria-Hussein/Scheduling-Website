var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path'); // Import the path module
var mysql = require("mysql");
const bcrypt = require('bcrypt');


// apply the body-parser middleware to all incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use express-session
// in memory session is sufficient for this assignment
app.use(session({
  secret: "csci4131secretkey",
  saveUninitialized: true,
  resave: false
}));

// server listens on port 9007 for incoming connections
app.listen(9007, () => console.log('Listening on port 9007!'));

// function to return the welcome page
app.get('/', (req, res) => {
  console.log("In Welcome");
  res.sendFile(path.join(__dirname, 'index.html'));
});

// handle login page
app.get('/login', (req, res) => {
  console.log("enter login");
  if (req.session.loggedIn) {
    // Redirect to the Schedule page if the user is logged in
    console.log("already logged in");
    res.redirect('/schedule');
  } else {
    // Otherwise, display the login page
    res.sendFile(path.join(__dirname, 'login.html'));
    
  }
});

// handle logout
app.get('/logout', (req, res) => {
  console.log("Logging out");
  // Destroy the session
  req.session.destroy(function(err) {
    if (err) {
      console.error("Error destroying session:", err);
    } else {
      console.log("Session destroyed successfully");
      // Redirect to the login page
      res.redirect('/login');
    }
  });
});

// handle login check
app.get('/logincheck', (req, res) => {
  var username = req.query.username;
  var password = req.query.password;
  console.log("in post username: " + username + " password: " + password);

  // Create Connection
  const connection = mysql.createConnection({
    host: "schedule-db.cdkq4kcmus2l.us-east-1.rds.amazonaws.com",
    user: "schedule-db",
    password: "Schedule20!",
    database: "schedule-db",
    port: 3306
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL database!");

    // Query for existing username
    var query = "SELECT * FROM tbl_accounts WHERE acc_login = ?";
    connection.query(query, [username], function(err, results) {
      if (err) throw err;

      if (results.length > 0) {
        var user = results[0];
        console.log("comparing");

        // Compare passwords if username exists
        if (bcrypt.compareSync(password, user.acc_password)) {
          // Password correct
          req.session.loggedIn = true;
          res.json({ status: 'success' });
        } else {
          // Password incorrect
          res.status(401).send('Invalid username or password');
        }
      } else {
        // Username doesn't exist
        res.status(401).send('Invalid username or password');
      }

      connection.end();
    });
  });
});

// handle schedule page
app.get('/schedule', (req, res) => {
  console.log("schedule endpoint");
  if (req.session.loggedIn) {
    // Redirect to the Schedule page if the user is logged in
    //console.log("already logged in")
    res.sendFile(path.join(__dirname, 'schedule.html'));
  } else {
    // Otherwise, redirect to login
    res.redirect('/login');
  }
});

// Fill in schedule information
app.get('/getSchedule', function(req, res) {
  console.log("getSchedule endpoint");
  
  // Get the day parameter from the query
  var day = req.query.day;
  console.log(day)
  
  // Establish connection
  var connection = mysql.createConnection({
    host: 'cse-mysql-classes-01.cse.umn.edu',
    user: 'C4131S24NU35',
    password: '1275',
    database: 'C4131S24NU35'
  });

  // Connect to the MySQL database
  connection.connect(function(err) {
    if (err) {
      throw err;
    } else {
      console.log("before query")
      // Query database for schedule information
      var query = "SELECT * FROM tbl_events WHERE event_day = ? ORDER BY STR_TO_DATE(event_start, '%h:%i %p')";
      connection.query(query, [day], function(err, rows, fields) {
        if (err) throw err;

        if (rows.length == 0){
          console.error("No entries found");
          res.json({status:'fail'})
        } else {
          //console.log(stringify(rows))
          console.log("Rows:", rows);
          var result = []
          // Add the schedule events to the result list
          for (var i = 0; i < rows.length; i++){
            result.push({ name: rows[i].event_event,
              start: rows[i].event_start,
              end: rows[i].event_end,
              location: rows[i].event_location,
              phone: rows[i].event_phone,
              info: rows[i].event_info,
              url: rows[i].event_url});
          }
          //console.log(results)
          res.json(result);
          //res.json({status:'success'})
        }
        // Close the database connection
        connection.end();
      });
    }
  });
});

app.get('/addEvent', function(req, res) {
  console.log("add Event endpoint");
  if (req.session.loggedIn) {
    // Redirect to the Schedule page if the user is logged in
    //console.log("already logged in")
    res.sendFile(path.join(__dirname, 'addEvent.html'));
  } else {
    // Otherwise, display the login page
    res.redirect('/login')
  }
});

app.get('/eventEntry', function(req, res) {
  // Extract form data from the request body
  var eventData = {
    event_day: req.query.day,
    event_event: req.query.event,
    event_start: req.query.start,
    event_end: req.query.end,
    event_location: req.query.location,
    event_phone: req.query.phone,
    event_info: req.query.info,
    event_url: req.query.url
  };
  console.log(eventData);
  // Create a connection to the MySQL database
  var connection = mysql.createConnection({
    host: 'cse-mysql-classes-01.cse.umn.edu',
    user: 'C4131S24NU35',
    password: '1275',
    database: 'C4131S24NU35'
  });

  // Connect to the MySQL database
  connection.connect(function(err) {
    if (err) {
      throw err;
    } else {
      // Insert the form data into the tbl_events table
      var query = "INSERT INTO tbl_events SET ?";
      connection.query(query, eventData, function(err, result) {
        if (err) {
          throw err;
        } else {
          console.log("Event inserted successfully!");
          // Redirect to the Schedule page upon successful insertion
          res.json({status:'success'})
          return;
        }
      });
    }
  });
});


//console.log(__dirname + '/static');
// middle ware to serve static files
//app.use('/static', express.static(__dirname + '/static'));


// function to return the 404 message and error to client
app.get('*', function(req, res) {
  // add details
  res.sendStatus(404);
});
