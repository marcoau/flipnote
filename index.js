var path = require('path');

//express middlewares
var express = require('express');
var favicon = require('static-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var app = express();

//Passport Authentiation
var passport = require('passport');
//passport configuration
require('./server/passport').passport(passport);

//custom modules
var config = require('./server/config');

//Socket.IO boilerplate
var http = require('http').Server(app);
var io = exports.io = require('socket.io')(http);

//Mongoose - schemas are imported in db modules
var mongoose = require('mongoose');
mongoose.connect(config.mongo.uri);
var db = require('./server/db');

//Passport-related middlewaves
app.use(cookieParser());
app.use(session({secret: 'deppilfsihturteht'}));
app.use(passport.initialize());
//persistent sessions
app.use(passport.session());
app.use(flash());

//simple logger
app.use(function(req, res, next){
  console.log(req.method + ': ' + req.url);
  next();
});

//load static resources & misc middlewares
app.use(express.static(__dirname + '/client'));
app.use(bodyParser());

//load all routes
require('./server/routes')(app, passport);

//http instead of app due to Socket.IO
http.listen(3000);
console.log('Flipnote server listening at 3000');
