angular.module('app', [
  'ui.router',
  'app.folders',
  'app.notes'
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){
    $stateProvider
      .state('home', {
        url: '/',
        views: {
          'folders': {
            templateUrl: '/modules/folders/folders.html',
            controller: 'FoldersCtrl'
          },
          'notes': {
            templateUrl: '/modules/notes/notes.html',
            controller: 'NotesCtrl'
          }
        }
      })
      .state('test', {
        url: '/test',
        templateUrl: '/modules/test/test.html'
      });

     $urlRouterProvider.otherwise('/');
     $locationProvider.html5Mode(true);
  }]);
