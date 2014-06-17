var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var noteSchema = new Schema({
  text_front: String,
  text_back: String,
  tags: Array,
  last_update: Date
});

var Note = mongoose.model('Note', noteSchema);
