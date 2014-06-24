//Node dependencies
var path = require('path');
var fs = require('fs');
var io = require('../index').io;

var mongoose = require('mongoose');
//for queries by ObjectId
var ObjectId = mongoose.Types.ObjectId;

//simple way to import DB models
var models = require('./db_models');

//declare models here
var User = exports.User = mongoose.model('User');
var Note = mongoose.model('Note');
var Folder = mongoose.model('Folder');

//general folder functions
exports.getAllFolders = function(req, res){
  var user_id = req.user._id;
  Folder.find(
    {user_id: user_id},
    {name: 1, user_id: 1, last_update: 1})
    .sort('-last_update')
    .exec(function(err, data){
      res.send(data);
    });
};
exports.createNewFolder = function(req, res){
  //get user id from req.user (passport stored data)
  var user_id = req.user._id;
  var name = req.body.name;
  var newFolder = new Folder({
    name: name,
    notes: [],
    last_update: new Date(),
    user_id: user_id
  });
  newFolder.save(function(err, data){
    if(err){
      console.error(err);
      res.send(500, 'Internal Server Error');
    }else{
      exports.getAllFolders(req, res);
    }
  });
};
exports.deleteFolder = function(req, res){
  var user_id = req.user._id;
  var fId = req.param('f_id');
  Folder.remove({_id: new ObjectId(fId)},
    function(err, data){
      if(err){
        console.error(err);
        res.send(500, 'Internal Server Error');
      }else{
        res.send('deleteFolder success');
      }
    });
};

exports.getFolderNotes = function(req, res){
  var fId = req.param('f_id');
  Folder.find({_id: new ObjectId(fId)},
    function(err, folders){
      if(err){
        console.error(err);
        res.send(500, 'Internal Server Error');
      }else{
        var notes = folders[0].notes;
        //sort the notes by date
        notes.sort(function(n1, n2){
          return n2.last_update - n1.last_update;
        });
        res.send(notes);
      }
    });
};
exports.createNewNote = function(req, res){
  var fId = req.param('f_id');
  var newNote = new Note({
    title: '',
    text_front: '',
    text_back: '',
    tags: [],
    last_update: new Date()
  });
  Folder.update(
    {_id: new ObjectId(fId)},
    {
      last_update: new Date(),
      $push: {notes: newNote}
    },
    function(err, data){
      if(err){
        console.error(err);
        res.send(500, 'Internal Server Error');
      }else{
        exports.getFolderNotes(req, res);
      }
    });
};

//general note functions
exports.updateNote = function(req, res){
  var fId = req.param('f_id');
  var nId = req.param('n_id');
  console.log('updateNote');
  //use $elemMatch to query for embedded documents
  Folder.update(
    {
      _id: new ObjectId(fId),
      notes: {$elemMatch: {_id: new ObjectId(nId)}}},
    {
      last_update: new Date(),
      'notes.$.title': req.body.title,
      'notes.$.text_front': req.body.text_front,
      'notes.$.text_back': req.body.text_back,
      'notes.$.last_update': new Date()
    },
    function(err, data){
      if(err){
        console.error(err);
        res.send(500, 'Internal Server Error');
      }else{
        res.send('updateNote success');
      }
    });
};
exports.deleteNote = function(req, res){
  var fId = req.param('f_id');
  var nId = req.param('n_id');
  console.log('deleteFolderNote');
  //use $pull to remove embedded documents from array
  Folder.update(
    {_id: new ObjectId(fId)},
    {
      last_update: new Date(),
      $pull: {notes: {_id: new ObjectId(nId)}}
    },
    function(err, data){
      if(err){
        console.error(err);
        res.send(500, 'Internal Server Error');
      }else{
        res.send('deleteNote success');
      }
    });
};

//note tag functions
exports.addNoteTag = function(req, res){
  var fId = req.param('f_id');
  var nId = req.param('n_id');
  var tag = req.body.tag;
  Folder.update(
    {
      _id: new ObjectId(fId),
      notes: {$elemMatch: {_id: new ObjectId(nId)}}
    },
    {
      last_update: new Date(),
      $push: {'notes.$.tags': tag}
    },
    function(err, data){
      if(err){
        console.error(err);
        res.send(500, 'Internal Server Error');
      }else{
        console.log(data);
        res.send('addNoteTag success');
      }
    });
};
