angular.module('app.home',[])

  .controller('HomeCtrl', ['$scope', '$state', '$http', function($scope, $state, $http){
    // $scope.test = function(){
    //   $state.go('test');
    // };

    //create Socket instance here; not ideal and to be relocated
    var socket = io();
    console.log(socket);

    //note functions
    $scope.flip = function(note){
      note.flipped = !note.flipped;
    };
    $scope.changeFront = function(note){
      socket.emit('changeFront', {_id: note._id, text_front: note.text_front});
    };
    $scope.changeBack = function(note){
      socket.emit('changeBack', {_id: note._id, text_back: note.text_back});
    };

    //fetch all notes on load
    $scope.fetchNotes = function(){
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
    };

    $scope.fetchNotes();

  }]);
