var path = require('path');

var db = require('./db');

module.exports = function(app, passport){

  var authCheck = function(req, res, next){
    if(req.isAuthenticated()){
      console.log(req.user);
      next();
    }else{
      res.redirect('/login');  
    }
  };

  //home page is home.html, not index.html
  app.get('/', authCheck, function(req, res){
    res.sendfile(path.normalize(__dirname + '/../client/home.html'));
  });  
  //login & signup routes; to be modularized
  app.get('/login', function(req, res){
    res.sendfile(path.normalize(__dirname + '/../client/login.html'));
  });
  app.get('/logout', function(req, res){
    //using exposed passport logout function
    req.logout();
    res.redirect('/login');
  });
  
  //passport auth
  app.post('/signup',
    passport.authenticate('local-signup', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    })
  );
  app.post('/login',
    passport.authenticate('local-login', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    })
  );

  //DB routes
  app.get('/folders', db.getAllFolders);
  app.post('/folders', db.createNewFolder);
  app.delete('/folders/:f_id', db.deleteFolder);
  
  app.get('/folders/:f_id/notes', db.getFolderNotes);
  app.post('/folders/:f_id/notes', db.createNewNote);
  app.post('/folders/:f_id/notes/:n_id', db.updateNote);
  app.delete('/folders/:f_id/notes/:n_id', db.deleteNote);

  app.post('/folders/:f_id/notes/:n_id/tags', db.addNoteTag);
};
