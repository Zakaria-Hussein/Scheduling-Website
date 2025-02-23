// YOU CAN USE THIS FILE AS REFERENCE FOR SERVER DEVELOPMENT

// include the express module
var express = require("express");

// create an express application
var app = express();
const url = require('url');

// helps in extracting the body portion of an incoming request stream
var bodyparser = require('body-parser');

// fs module - provides an API for interacting with the file system
var fs = require("fs");

// helps in managing user sessions
var session = require('express-session');

// include the mysql module
var mysql = require("mysql");

var path = require("path");

// helpful for reading, compiling, rendering pug templates
const pug = require("pug");  
app.set("views", path.join(__dirname, "client"));
app.set("view engine", "pug");


// Bcrypt library for comparing password hashes
const bcrypt = require('bcrypt');
const { resourceLimits } = require("worker_threads");

// A  library that can help read uploaded file for bonus.
// var formidable = require('formidable')

const dbCon = mysql.createConnection({
  host: "cse-mysql-classes-01.cse.umn.edu",
  user: "C4131DF23U66",               // replace with the database user provided to you
  password: "4406",                  // replace with the database password provided to you
  database: "C4131DF23U66",           // replace with the database user provided to you
  port: 3306
});

// apply the body-parser middleware to all incoming requests
app.use(bodyparser());

// use express-session
// in mremory session is sufficient for this assignment
app.use(session({
  secret: "csci4131secretkey",
  saveUninitialized: true,
  resave: false
}
));

// server listens on port 9007 for incoming connections
app.listen(9007, () => console.log('Listening on port 9007!'));


// function to return the welcome page
app.get('/',function(req, res) {
  res.render("welcome");
});

//function to return the login page
app.get('/login', function(req, res){
  if (req.session.user == undefined){
    res.render("login");
  }
  else {
    res.redirect("/schedule");
  }
});

//function to return the schedule page
app.get('/schedule', function(req, res){
  if (req.session.user == undefined){
    res.redirect("/login");
  }
  else {
    res.render("schedule");
  }
})

app.post("/loggingIn", function(req, res){
  var user = req.body.username;
  var pass = req.body.password;

  dbCon.query("SELECT * from tbl_accounts WHERE acc_login = " + mysql.escape(user), function(err, entries){
    if (err) throw err;
    if (entries.length > 0){
      if (bcrypt.compareSync(pass, entries[0].acc_password)){
        req.session.user = user;
        res.json({status: "success"});
      }
      else {
        res.json({status: "failure"});
      }
    }
    else {
      res.json({status: "failure"});
    }
  })
});

app.get("/getSchedule", function(req, res){
  dbCon.query("SELECT * FROM tbl_events ORDER BY event_start ASC", function(err, entries){
    if (err) throw err;
    res.statusCode = 200;
    res.setHeader("Content-type", "application/json");
    res.write(JSON.stringify(entries));
    res.end();
  })
});

app.get("/editEvent", function (req, res) {
  if (req.session.user == undefined){
    res.redirect("/login");
  }
  else {
    var eventID = req.query.eventID;
    dbCon.query("SELECT * from tbl_events WHERE event_id = " + mysql.escape(eventID), function(err, entries){
      if (err) throw err;

      if (entries.length > 0) {
        let eventData = entries[0];
        res.render("editEvent", { eventData: eventData });
      } else {
        res.sendStatus(404);
      }
    });
  }
});

app.get("/addEvent", function(req, res){
  if (req.session.user == undefined){
    res.redirect("/login");
  }
  else {
    res.render("addEvent");
  }
});

app.post("/postEventEntry", function(req, res){
  let event = {
    event_day: req.body.day,
    event_event: req.body.event,
    event_start: req.body.start,
    event_end: req.body.end,
    event_location : req.body.location,
    event_phone: req.body.phone,
    event_info: req.body.info,
    event_url: req.body.url
  };

  dbCon.query("INSERT tbl_events SET ?", event, function(err, entries){
    if (err) throw err;
    res.redirect("/schedule");
  });
});

app.get("/logout", function(req, res){
  if (req.session){
    req.session.destroy(function(err){
      if (err) throw err;
      res.redirect("/login");
    });
  }
});

// middle ware to serve static files
app.use('/client', express.static(__dirname + '/client'));

app.post("/updateEvent", function (req, res) {
  let eventID = req.query.eventID;
  let event = {
    event_day: req.body.day,
    event_event: req.body.event,
    event_start: req.body.start,
    event_end: req.body.end,
    event_location : req.body.location,
    event_phone: req.body.phone,
    event_info: req.body.info,
    event_url: req.body.url
  };

  dbCon.query("SELECT * from tbl_events WHERE event_id = " + mysql.escape(eventID), function(err, entries){
    if (err) throw err;

    if (entries.length > 0){
      dbCon.query("UPDATE tbl_events SET ? WHERE event_id = " + mysql.escape(eventID), event, function(err, entries){ 
        if (err) {
          res.sendStatus(422);
          throw err;
        } else {
          res.redirect("/schedule");
        }

      })
    } else {
      res.sendStatus(404);
    }
  });
});

// function to return the 404 message and error to client
app.get('*', function(req, res) {
  // add details
  res.sendStatus(404);
});

app.delete("/deleteEvent/:eventId", function (req, res) {
  const eventId = req.params.eventId;
  dbCon.query("SELECT * FROM tbl_events WHERE event_id = " + eventId, function (err, result) {
    if (err) throw err;

    if (result.length > 0) {
      dbCon.query("DELETE from tbl_events where event_id = " + eventId, function (err, entries) {
        if (err) throw err;
        res.sendStatus(200); 
      });
    } else {
      res.sendStatus(404);
    }
  });
});


