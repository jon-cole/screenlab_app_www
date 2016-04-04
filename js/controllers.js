angular.module('app.controllers', [])

.controller('loginCtrl', function (userService, $scope, $ionicPopup, $state) {
    var userDetails = userService.getUser();
    $scope.email = userDetails.email;
    $scope.password = userDetails.password;
    $scope.login = function (email, password) {
        userService.verify(email, password)
            .then(function () {
                userService.saveUser();
                $ionicPopup.alert({
                    title: 'Success!',
                    content: 'Your details have been verified. Tap "OK" to go to your scan history.'
                }).then(function(){
                    $state.go('yourScans');
                });
                
            }, function (error) {
                $ionicPopup.alert({
                    title: 'Login Failure',
                    content: 'Authentication failed. Please check your username and password and ensure you are connected to the internet.'
                });
            });

    };

})

.controller('yourScansCtrl', function ($scope) {

})

.controller('scanNameCtrl', function ($scope) {

})
