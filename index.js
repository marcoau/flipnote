var path = require('path');

//express middlewares
var express = require('express');
var favicon = require('static-favicon');
var bodyParser = require('body-parser');
var app = express();

//custom modules
var config = require('./server/config');

//Socket.IO boilerplate
var http = require('http').Server(app);
var io = exports.io = require('socket.io')(http);

//Mongoose - schemas are imported in db modules
var mongoose = require('mongoose');
mongoose.connect(config.mongo.uri);
var db = require('./server/db');

//simple logger
app.use(function(req, res, next){
  console.log(req.method + ': ' + req.url);
  next();
});

//load static resources & misc middlewares
app.use(express.static(__dirname + '/client'));
app.use(bodyParser());

//DB routes
app.get('/folders', db.getAllFolders);
app.post('/folders', db.createNewFolder);
app.get('/folders/:f_id/notes', db.getFolderNotes);

app.post('/folders/:f_id/notes', db.createNewNote);

app.post('/folders/:f_id/notes/:n_id', db.updateNote);
app.delete('/folders/:f_id/notes/:n_id', db.deleteNote);

app.post('/folders/:f_id/notes/:n_id/tags', db.addNoteTag);

//load any static views if it is not a specific route
app.get('/*', function(req, res){
  res.sendfile(path.resolve(__dirname + '/client/index.html'));
});

//http instead of app due to Socket.IO
http.listen(3000);
console.log('Flipnote server listening at 3000');
