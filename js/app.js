// ScreenLab App

angular.module('app', ['ionic', 'ngCordova', 'cordovaNetwork', 'rootScope', 'ionicLazyLoadCache', 'ngJustGage', 'ngImgCache', 'app.controllers', 'app.routes', 'app.services'])

//.config(function(ImgCacheProvider) {
//ImgCacheProvider.setOptions({ debug: true, usePersistentCache: true });
//ImgCacheProvider.manualInit = true; })

.run(function($ionicPlatform) {
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
