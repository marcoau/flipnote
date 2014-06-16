var path = require('path');

//express middlewares
var express = require('express');
var favicon = require('static-favicon');
var bodyParser = require('body-parser');
var router = require('./server/router');
var app = express();

//custom modules
var config = require('./server/config');

//Socket.IO boilerplate
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Mongoose - schemas are imported in db modules
var mongoose = require('mongoose');
mongoose.connect(config.mongo.uri);
var db = require('./server/db');

//simple logger
app.use(function(req, res, next){
  console.log(req.method + ': ' + req.url);
  next();
});

//load static resources
app.use(express.static(__dirname + '/client'));

app.get('/notes', db.getAllNotes);

//load any static views if it is not a specific route
app.get('/*', function(req, res){
  res.sendfile(path.resolve(__dirname + '/client/index.html'));
});

io.on('connection', function(socket){
  socket.on('receiveTest', function(data){
    var message = data.message + data.message;
    socket.emit('returnTest', {message: message});
  });
})

//http instead of app due to Socket.IO
http.listen(3000);
console.log('Flipnote server listening at 3000');
