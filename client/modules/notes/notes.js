angular.module('app.notes',[])

  .controller('NotesCtrl', ['$rootScope', '$scope', '$state', '$http', function($rootScope, $scope, $state, $http){

    //create Socket instance here; not ideal and to be relocated
    // var socket = io();

    //for displaying of sync status
    $rootScope.updating = false;

    //define note size classes for dynamic resizing
    $scope.noteSizeClasses = {
      1: 'note-extra-small',
      2: 'note-small',
      3: 'note-medium',
      4: 'note-large',
      5: 'note-extra-large'
    };
    $scope.noteSize = 4;

    //zooming in & out
    $scope.zoomIn = function(){
      console.log('zoomIn');
      if($scope.noteSize < 5){
        $scope.noteSize++;
      }
    };
    $scope.zoomOut = function(){
      console.log('zoomOut');
      if($scope.noteSize > 1){
        $scope.noteSize--;
      }
    };

    //note functions
    $scope.createNewNote = function(){
      console.log('createNewNote');
      //check if there is an active folder to create note in
      if($rootScope.activeFolder){
        //toggle status
        $rootScope.updating = true;

        $http({
          method: 'POST',
          url: '/folders/' + $rootScope.activeFolder._id + '/notes'
        })
        .success(function(data){
          //necessary due to _id of new note
          $rootScope.notes = _.map(data, function(note){
            return _.extend(note, {
              flipped: false,
              unsynced: false,
              //faciliate addTag functionality
              addingTag: false
            });
          });
          //toggle status
          $rootScope.updating = false;
        })
        .error(function(error){
          console.error(error);
        });        
      }
    };
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
      note.addingTag = !note.addingTag;
      if(note.addingTag){
        //utilize focusMe directive
        note.focusNewTag = true;
      }else{
        note.focusNewTag = undefined;
        note.newTag = undefined;
      }
    };
    $scope.saveNoteTag = function($event, note){
      if(event.keyCode === 13){
        //click enter
        
        var newTag = note.newTag;
        note.unsynced = true;

        $scope.toggleNoteTag(note);

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
      }

    };
  }])

  //used to focus textboxes
  .directive('focusTag', function($timeout, $parse){
    return {
      link: function(scope, element, attrs){
        var model = $parse(attrs.focusTag);
        scope.$watch(model, function(value){
          if(value === true){
            $timeout(function(){
              element[0].focus(); 
            });
          }else{
            $timeout(function(){
              element[0].blur();
            });
          }
        });
        // set attribute value to 'undefined' on blur event:
        element.bind('blur', function(){
           scope.$apply(model.assign(scope, undefined));
        });
      }
    };
  });
