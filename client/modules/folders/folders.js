angular.module('app.folders',[])
  
  .controller('FoldersCtrl', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http){

    $scope.fetchFolders = function(){
      $http({
        method: 'GET',
        url: '/folders',
      })
      .success(function(data){
        $rootScope.folders = _.map(data, function(folder){
          return _.extend(folder, {
            active: false
          });
        });
        //make folder with most recent update time active
        $scope.getFolderNotes($rootScope.folders[0]);
      })
      .error(function(error){
        console.error(error);
      });
    };

    $scope.getFolderNotes = function(folder){
      //toggle status
      $rootScope.updating = true;

      if($rootScope.activeFolder){
        //change status of old active folder to not active
        $rootScope.activeFolder.active = false;        
      }

      //update folder status
      folder.active = true;
      $rootScope.activeFolder = folder;

      $http({
        method: 'GET',
        url: '/folders/' + folder._id + '/notes'
      })
      .success(function(data){
        $rootScope.notes = _.map(data, function(note){
          return _.extend(note, {
            flipped: false,
            unsynced: false,
            addingTag: false
          });
        });
        $rootScope.updating = false;
      })
      .error(function(error){
        console.error(error);
      });
    };
    $scope.createNewFolder = function($event){
      if(event.keyCode === 13 && $scope.newFolder){
        //click enter

        //toggle status
        $rootScope.updating = true;
        var newFolder = $scope.newFolder;
        //close new folder box
        $scope.toggleNewFolder();

        $http({
          method: 'POST',
          url: '/folders/',
          data: {name: newFolder}
        })
        .success(function(data){
          //necessary due to _id of new folder
          $rootScope.folders = _.map(data, function(folder){
            return _.extend(folder, {
              active: false
            });
          });
          //toggle status
          $rootScope.updating = false;
        });
      }
    };
    $scope.toggleNewFolder = function(){
      $scope.creatingFolder = !$scope.creatingFolder;
      //jquery, to be refactored
      if($scope.creatingFolder){
        //utilize focusMe directive
        $scope.newFolderFocus = true;
      }else{
        console.log('false');
        $scope.newFolderFocus = false;
      }
      $scope.newFolder = undefined;
    };

    $scope.creatingFolder = false;
    $scope.newFolderFocus = false;
    //fetch all folders on load
    $scope.fetchFolders();
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
          }else{
            $timeout(function(){
              element[0].blur();
            });
          }
        });
        // set attribute value to 'false' on blur event:
        element.bind('blur', function(){
          console.log('here');
          scope.$apply(model.assign(scope, false));
        });
      }
    };
  });
