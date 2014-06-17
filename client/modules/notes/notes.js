angular.module('app.notes',[])

  .controller('NotesCtrl', ['$scope', '$state', '$http', function($scope, $state, $http){

    //create Socket instance here; not ideal and to be relocated
    var socket = io();
    console.log(socket);

    //for displaying of sync status
    $scope.updating = false;

    //note functions
    $scope.updateNote = function(note){
      //toggle note status
      note.unsynced = true;
      console.log($scope.updating);

      $http({
        method: 'POST',
        url: '/notes/' + note._id,
        data: {
          text_front: note.text_front,
          text_back: note.text_back
        }
      })
      .success(function(data){
        //toggle note status
        note.unsynced = false;
      });
    };
    $scope.flip = function(note){
      note.flipped = !note.flipped;
    };
    $scope.delete = function(note){
      //toggle note status
      note.unsynced = true;

      $http({
        method: 'DELETE',
        url: '/notes/' + note._id
      })
      .success(function(data){
        //toggle note status
        note.unsynced = false;
        $scope.notes.splice($scope.notes.indexOf(note), 1);
      })
      .error(function(error){
        console.log(error);
      });
    };

    //fetch all notes on load
    $scope.fetchNotes = function(){
      //toggle status
      $scope.updating = true;

      $http({
        method: 'GET',
        url: '/notes'
      })
      .success(function(data){
        $scope.notes = _.map(data, function(note){
          return _.extend(note, {
            flipped: false,
            unsynced: false
          });
        });
        //toggle status
        $scope.updating = false;
      })
      .error(function(error){
        console.error(error);
      });
    };

    //create new note and fetch updated collection of notes
    $scope.createNewNote = function(){
      //toggle status
      $scope.updating = true;

      $http({
        method: 'POST',
        url: '/notes/'
      })
      .success(function(data){
        //necessary due to _id of new note
        $scope.notes = _.map(data, function(note){
          return _.extend(note, {flipped: false});
        });
        //toggle status
        $scope.updating = false;          
      })
      .error(function(error){
        console.error(error);
      });
    };

    //tag functions
    $scope.toggleNoteTag = function(note){
      console.log('toggleNoteTag');
      note.addingTag = !note.addingTag;
      if(!note.addingTag){
        note.newTag = undefined;
      }
    };
    $scope.saveNoteTag = function($event, note){
      if(event.keyCode === 13){
        //clicked enter
        
        var newTag = note.newTag;
        note.unsynced = true;

        $http({
          method: 'POST',
          url: '/notes/' + note._id + '/tag',
          data: {tag: newTag}
        })
        .success(function(data){
          //local update of tags
          note.unsynced = false;
          note.tags.push(newTag);
        })
        .error(function(error){
          console.error(error);
        });

        //update tagbox
        note.addingTag = false;
        note.newTag = undefined;
      }
    };

    //fetch notes on load
    $scope.fetchNotes();
  }]);
