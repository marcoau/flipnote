var mongoose = require('mongoose');
var path = require('path');
var fs = require('fs');

//require all MongoDB Model files, and initialize all model schemas
var modelsPath = path.join(__dirname, '/db_models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});

var Note = mongoose.model('Note');


exports.getAllNotes = function(req, res){
  Note.find({}, function(err, data){
    res.send(data);
  });
};
