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
      })
      .error(function(error){
        console.error(error);
      });
    };

    $scope.getFolderNotes = function(folder){
      //toggle status
      $rootScope.updating = true;

      console.log('getFolderNotes');

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
            unsynced: false
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
        //close new folder box
        //toggle status
        $rootScope.updating = true;
        var newFolder = $scope.newFolder;
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
      $scope.newFolder = undefined;
    };

    $scope.createNewNote = function($event){
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
              unsynced: false
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

    $scope.creatingFolder = false;
    //fetch all folders on load
    $scope.fetchFolders();
  }]);
