angular.module('app.controllers', [])

.controller('loginCtrl', function (userService, $scope, $ionicPopup, $state) {
    var userDetails = userService.getUser();
    $scope.email = userDetails.email;
    $scope.password = userDetails.password;
    $scope.login = function (email, password) {
        userService.verify(email, password)
            .then(function () {
                userService.saveUser(email, password);
                $ionicPopup.alert({
                    title: 'Success!',
                    content: 'Your details have been verified. Tap "OK" to go to your scan history.'
                }).then(function () {
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

.controller('yourScansCtrl', function ($scope, $state, userService, imageService, tokenService, scanService) {
    var userDetails = userService.getUser();
    var email = userDetails.email;
    var password = userDetails.password;
    $scope.scans = userDetails.scans;


    $scope.getScans = function () {
        tokenService.getToken(email, password).then(function (token) {
            scanService.getScans(token).then(function (scans) {
                $scope.scans = scans;
            }, function (error) {
                // Scan service error
            })
        }, function (error) {
            // Token error
        });
    };
    $scope.getScans();
    $scope.newPhoto = function () {
        tokenService.getToken(email, password).then(function (token) {
            imageService.getImage().then(function (imageData) {
                scanService.postScan(token, imageData).then(function (scanData) {
                    $state.go('scanName', {"scan": scanData});
                }, function (error) {
                    // No scan returned
                });

            }, function (error) {
                // No image error
            });
        }, function (error) {
            // Token failure
        });
    };
    $scope.scanDetail = function(scan){
        $state.go('scanName', {"scan": scan});
        
    };
})

.controller('scanNameCtrl', function ($scope, $state, $stateParams) {
    $scope.scan = $stateParams.scan; 
})
