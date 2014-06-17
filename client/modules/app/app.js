angular.module('app', [
  'ui.router',
  'app.home'
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '/modules/home/home.html',
        controller: 'HomeCtrl'
      })
      .state('test', {
        url: '/test',
        templateUrl: '/modules/test/test.html'
      });

     $urlRouterProvider.otherwise('/');
     $locationProvider.html5Mode(true);
  }]);
