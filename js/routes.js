angular.module('app.routes', [])

.config(function ($stateProvider, $urlRouterProvider) {
  // This app has three simple states:
  // login for the user to login
  // yourScans to show a list of scan results
  // scanName to give a detailed view of a scan
  
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
        params: {
            scan: null
        }
    });

    $urlRouterProvider.otherwise('/login');

});
