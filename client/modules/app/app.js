angular.module('app', [
  'ui.router',
  'app.notes'
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){
    $stateProvider
      .state('home', {
        url: '/',
        views: {
          'notes': {
            templateUrl: '/modules/notes/notes.html',
            controller: 'NotesCtrl'
          }
        }
        // templateUrl: '/modules/home/home.html',
        // controller: 'HomeCtrl'
      })
      .state('test', {
        url: '/test',
        templateUrl: '/modules/test/test.html'
      });

     $urlRouterProvider.otherwise('/');
     $locationProvider.html5Mode(true);
  }]);
