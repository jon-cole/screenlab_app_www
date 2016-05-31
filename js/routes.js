angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('yourScans', {
    url: '/scans',
    templateUrl: 'templates/yourScans.html',
    controller: 'yourScansCtrl'
  })

  .state('scanName', {
    url: '/scan',
    templateUrl: 'templates/scanName.html',
    controller: 'scanNameCtrl',
    params: {scan : null }
  })

$urlRouterProvider.otherwise('/scans')



});
