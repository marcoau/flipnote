var bcrypt = require('bcrypt');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//user model
var userSchema = new Schema({
  username: String,
  password: String
});
//USER METHODS
// generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};
// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', userSchema);


//note model
var noteSchema = new Schema({
  title: String,
  text_front: String,
  text_back: String,
  tags: Array,
  last_update: Date
});

var Note = mongoose.model('Note', noteSchema);

//folder model
var folderSchema = new Schema({
  name: String,
  notes: [noteSchema],
  last_update: Date,
  user_id: String
});

var Folder = mongoose.model('Folder', folderSchema);
