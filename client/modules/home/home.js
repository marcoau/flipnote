angular.module('app.home',[])

  .controller('HomeCtrl', ['$scope', '$state', '$http', function($scope, $state, $http){
    $scope.test = function(){
      $state.go('test');
    };

    $scope.flip = function(note){
      note.flipped = !note.flipped;
    };

    //fetch all notes
    $http({
      method: 'GET',
      url: '/notes'
    })
    .success(function(data){
      $scope.notes = _.map(data, function(note){
        return _.extend(note, {flipped: false});
      });
    })
    .error(function(error){
      console.error(error);
    });


  }]);
