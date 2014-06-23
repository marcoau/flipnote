var LocalStrategy = require('passport-local').Strategy;

var db = require('./db');

exports.passport = function(passport){
  
  //serializing user for the session
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });
  //deserializing user
  passport.deserializeUser(function(id, done){
    db.User.findById(id, function(err, user){
      done(err, user);
    });
  });

  //signing up
  passport.use('local-signup', new LocalStrategy(
    {
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done){
      // asynchronous - User.findOne wont fire unless data is sent back
      process.nextTick(function(){
        // we are checking to see if the user trying to login already exists
        db.User.findOne({username: username}, function(err, user){
          // if there are any errors, return the error
          if(err){
            return done(err);
          }
          // check to see if theres already a user with that username
          if(user){
            return done(null, false, req.flash('signupMessage', 'Sorry, username taken.'));
          }else{
            // if there is no user with that username, create the user
            var newUser = new db.User();
            // set the user's local credentials
            newUser.username = username;
            newUser.password = newUser.generateHash(password);
            // save the user
            newUser.save(function(err){
              if (err) throw err;
              return done(null, newUser);
            });
          }
        });
      });
    }));
  
  //logging in
  passport.use('local-login', new LocalStrategy(
    {
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done){
      // find a user with the given username
      db.User.findOne({'username': username}, function(err, user){
        // if there are any errors, return the error before anything else
        if(err){
          return done(err);
        }
        // if no user is found, return the message
        if(!user){
          return done(null, false, req.flash('loginMessage', 'No user found.'));
        }
        // if the user is found but the password is wrong
        if(!user.validPassword(password)){
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
        }
        // all is well, return successful user
        return done(null, user);
      });
    }));
};
