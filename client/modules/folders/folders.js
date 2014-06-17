angular.module('app.folders',[])
  
  .controller('FoldersCtrl', ['$scope', function($scope){
    $scope.folders = [
      {name: 'AngularJS', notes: []},
      {name: 'Backbone.js', notes: []},
      {name: 'Golang', notes: []}
    ];
  }]);
