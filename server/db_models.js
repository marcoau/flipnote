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
