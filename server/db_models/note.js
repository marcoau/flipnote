var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var noteSchema = new Schema({
  text_front: String,
  text_back: String,
  last_update: Date
});

var Note = mongoose.model('Note', noteSchema);

var note = new Note({
  text_front: 'Hello World',
  text_back: 'You\'re pitifullll',
  last_update: new Date()
});

note.save(function(err){
  if(err){
    console.log('DB ERROR: ' + err);
  }
  console.log('note saved!');
});

// Note.find({}, function(err, data){
//   console.log(data);
// });
