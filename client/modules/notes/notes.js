angular.module('app.notes',[])

  .controller('NotesCtrl', ['$rootScope', '$scope', '$state', '$http', function($rootScope, $scope, $state, $http){

    //create Socket instance here; not ideal and to be relocated
    var socket = io();

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
      note.addingTag = !note.addingTag;
      if(note.addingTag){
        //utilize focusMe directive
        note.focusNewTag = true;
      }else{
        note.newTag = undefined;
      }
    };
    $scope.saveNoteTag = function($event, note){
      if(event.keyCode === 13){
        //click enter
        
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

      }else if(event.keyCode === 27){
        //click esc
        $scope.toggleNoteTag();
      }

    };
  }])

  //used to focus textboxes
  .directive('focusMe', function($timeout, $parse){
    return {
      link: function(scope, element, attrs){
        var model = $parse(attrs.focusMe);
        scope.$watch(model, function(value){
          if(value === true){
            $timeout(function(){
              element[0].focus(); 
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

