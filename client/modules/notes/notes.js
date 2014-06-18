angular.module('app.notes',[])

  .controller('NotesCtrl', ['$rootScope', '$scope', '$state', '$http', function($rootScope, $scope, $state, $http){

    //create Socket instance here; not ideal and to be relocated
    var socket = io();
    console.log(socket);

    //for displaying of sync status
    $rootScope.updating = false;

    //note functions
    $scope.updateNote = function(note){
      //toggle note status
      note.unsynced = true;

      $http({
        method: 'POST',
        url: '/folders/' + $rootScope.activeFolder._id + '/notes/' + note._id,
        data: {
          text_front: note.text_front,
          text_back: note.text_back
        }
      })
      .success(function(data){
        //toggle note status
        note.unsynced = false;
      })
      .error(function(error){
        console.error(error);
      });
    };
    $scope.delete = function(note){
      //toggle note status
      note.unsynced = true;

      $http({
        method: 'DELETE',
        url: '/folders/' + $rootScope.activeFolder._id + '/notes/' + note._id
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
    $scope.flip = function(note){
      note.flipped = !note.flipped;
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
          url: '/folders/' + $rootScope.activeFolder._id + '/notes/' + note._id + '/tags',
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
  }]);
