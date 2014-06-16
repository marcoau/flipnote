//Node dependencies
var path = require('path');
var fs = require('fs');
var io = require('../index').io;

var mongoose = require('mongoose');
//for queries by ObjectId
var ObjectId = mongoose.Types.ObjectId;

//require all MongoDB Model files, and initialize all model schemas
var modelsPath = path.join(__dirname, '/db_models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});

var Note = mongoose.model('Note');


exports.getAllNotes = function(req, res){
  console.log('getAllNotes');
  Note.find({})
    .sort('-last_update')
    .exec(function(err, data){
      res.send(data);
    });
};

exports.createNewNote = function(req, res){
  console.log('createNewNote');
  var newNote = new Note({
    text_front: '',
    text_back: '',
    last_update: new Date()
  });

  newNote.save(function(err){
    if(err){
      console.error(err);
    }else{
      // send back latest collection of all notes
      exports.getAllNotes(req, res);
    }
  });
};

exports.deleteNote = function(req, res){
  var id = req.param('id');
  Note.remove({_id: new ObjectId(id)},
    function(err, data){
      if(err){
        console.error(err);
      }else{
        // send back latest collection of all notes
        exports.getAllNotes(req ,res);
      }
    });
};

//real-time updating to database with Socket.IO
io.on('connection', function(socket){

  //change text_front
  socket.on('changeFront', function(data){
    Note.findOneAndUpdate(
      {_id: new ObjectId(data._id)},
      {text_front: data.text_front},
      function(err, data){
        if(err){
          console.error(err);
        }
      });
  });

  //change text_back
  socket.on('changeBack', function(data){
    Note.findOneAndUpdate(
      {_id: new ObjectId(data._id)},
      {text_back: data.text_back},
      function(err, data){
        if(err){
          console.error(err);
        }
      });
  });
});
