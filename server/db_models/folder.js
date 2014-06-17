var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var folderSchema = new Schema({
  name: String,
  notes: [noteSchema]
});

var Folder = mongoose.model('Folder', folderSchema);
