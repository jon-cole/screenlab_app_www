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
    $scope.loading = false;
    $scope.scansError = false;
    $scope.tokenError = false;


    $scope.getScans = function () {
        tokenService.getToken(email, password).then(function (token) {
            scanService.getScans(token).then(function (scans) {
                $scope.scans = scans;
                $scope.scansError = false;
                $scope.tokenError = false;
            }, function (error) {
                $scope.scansError = true;
            })
        }, function (error) {
            $scope.tokenError = true;
        });
    };
    $scope.getScans();
    $scope.newPhoto = function () {
        tokenService.getToken(email, password).then(function (token) {
            imageService.getImage().then(function (imageData) {
                $scope.loading = true;
                scanService.postScan(token, imageData).then(function (scanData) {
                    $scope.scansError = false;
                    $scope.tokenError = false;
                    $scope.loading = false;
                    $state.go('scanName', {"scan": scanData});
                }, function (error) {
                    $scope.scansError = true;
                });

            }, function (error) {
                // No image error
            });
        }, function (error) {
            $scope.tokenError = true;
        });
    };
    
    $scope.doRefresh = function(){
        tokenService.getToken(email, password).then(function (token) {
            scanService.getScans(token).then(function (scans) {
                $scope.scans = scans;
                $scope.$broadcast('scroll.refreshComplete');
                $scope.scansError = false;
                $scope.tokenError = false;
            }, function (error) {
                $scope.scansError = false;
                 $scope.$broadcast('scroll.refreshComplete');
            })
        }, function (error) {
            $scope.scansError = true;
             $scope.$broadcast('scroll.refreshComplete');
        });
            
        
    };
    
    
    $scope.scanDetail = function(scan){
        $scope.getScans();
        $state.go('scanName', {"scan": scan});
        
    };
})

.controller('scanNameCtrl', function ($scope, $state, $stateParams) {
    $scope.scan = $stateParams.scan; 

    
})
