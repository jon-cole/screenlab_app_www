angular.module('app.controllers', [])

.controller('loginCtrl', function (userService, $scope, $ionicPopup) {
    var userDetails = userService.getUser();
    $scope.email = userDetails.email;
    $scope.password = userDetails.password;
    $scope.login = function () {
        userService.verify($scope.email, $scope.password)
            .then(function () {
                userService.saveUser();
                $state.transitionTo("login");
            }, function () {
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
