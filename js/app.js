// ScreenLab App
angular.module('app', ['ionic', 'ngCordova', 'ionicLazyLoadCache', 'ngJustGage', 'ngImgCache', 'app.controllers', 'app.routes', 'app.services'])

.run(function ($ionicPlatform, userService, $state) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        // Inititialise the image cache for offline use
        ImgCache.init();
    });
});
