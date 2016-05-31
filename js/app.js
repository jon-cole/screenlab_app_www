// ScreenLab App

angular.module('app', ['ionic', 'ngCordova', 'ionicLazyLoadCache', 'ngJustGage', 'ngImgCache', 'app.controllers', 'app.routes', 'app.services'])

//.config(function(ImgCacheProvider) {
//ImgCacheProvider.setOptions({ debug: true, usePersistentCache: true });
//ImgCacheProvider.manualInit = true; })

.run(function($ionicPlatform, $rootScope, $state) {
  $rootScope.on('$locationChangeStart', function(event, next, current) {
    // check for the user's token and that we aren't going to the login view
    var userDetails = userService.getUser();
    if((angular.isUndefined(userDetails)||angular.isUndefined(userDetails.email)||userDetails.email=="") && next.templateUrl != 'login.html'){
      // go to the login view
      $state.go('login');
    }
  }
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    ImgCache.init();
  });
})
