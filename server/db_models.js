var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//note model
var noteSchema = new Schema({
  text_front: String,
  text_back: String,
  tags: Array,
  last_update: Date
});

var Note = mongoose.model('Note', noteSchema);

//folder model
var folderSchema = new Schema({
  name: String,
  notes: [noteSchema]
});

var Folder = mongoose.model('Folder', folderSchema);

//testing
var firstNote = new Note({
  text_front: 'Hello!',
  text_back: 'World!',
  tags: ['basics', 'hello'],
  last_update: new Date()
});

var firstFolder = new Folder({
  name: 'firstFolder',
  notes: []
});
firstFolder.save(function(err, data){
  // console.log(data);
  Folder.update({name: 'firstFolder'},
    {$push: {notes: firstNote}},
    function(err, data){
      if(err){
        console.error(err);
      }else{
        console.log(data);
      }
    });
});

Folder.find({name: 'firstFolder'},
  function(err, data){
    console.log(data);
  });
