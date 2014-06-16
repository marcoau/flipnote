angular.module('app.home',[])

  .controller('HomeCtrl', ['$scope', '$state', '$http', function($scope, $state, $http){
    // $scope.test = function(){
    //   $state.go('test');
    // };

    //create Socket instance here; not ideal and to be relocated
    var socket = io();
    console.log(socket);

    //note functions
    $scope.changeFront = function(note){
      socket.emit('changeFront', {_id: note._id, text_front: note.text_front});
    };
    $scope.changeBack = function(note){
      socket.emit('changeBack', {_id: note._id, text_back: note.text_back});
    };
    $scope.flip = function(note){
      note.flipped = !note.flipped;
    };
    $scope.delete = function(note){
      $http({
        method: 'DELETE',
        url: '/notes/id/' + note._id
      })
      .success(function(data){
        $scope.notes = _.map(data, function(note){
          return _.extend(note, {flipped: false});
        });
      })
      .error(function(error){
        console.log(error);
      });
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

    //create new note and fetch updated collection of notes
    $scope.createNewNote = function(){
      $http({
        method: 'POST',
        url: '/notes/new_note'
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
