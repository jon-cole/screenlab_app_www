angular.module('app.controllers', [])

.controller('loginCtrl', function (userService, $scope, $ionicPopup) {
    var userDetails = userService.getUser();
    $scope.email = userDetails.email;
    $scope.password = userDetails.password;
    $scope.login = function (email, password) {
        userService.verify(email, password)
            .then(function () {
                userService.saveUser();
                $state.transitionTo("yourScans");
            }, function (error) {
                $ionicPopup.alert({
                    title: 'Login Failure',
                    //content: 'Authentication failed. Please check your username and password and ensure you are connected to the internet.'
                    content: JSON.stringify(error)
                });
            });

    };

})

.controller('yourScansCtrl', function ($scope) {

})

.controller('scanNameCtrl', function ($scope) {

})
