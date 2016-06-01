angular.module('app.controllers', [])

.controller('loginCtrl', function(userService, networkService, $rootScope, $scope, $ionicPopup, $state) {
    var userDetails = userService.getUser();
    if (angular.isUndefined($rootScope.firstRun) && userDetails.email != null) {
        $state.go('yourScans');
    };
    $scope.email = userDetails.email;
    $scope.password = userDetails.password;
    $scope.login = function(email, password) {
        userService.verify(email, password)
            .then(function() {
                userService.saveUser(email, password);
                $ionicPopup.alert({
                    title: 'Success!',
                    content: 'Your details have been verified. Tap "OK" to go to your scan history.'
                }).then(function() {
                    $state.go('yourScans');
                });

            }, function(error) {
                $ionicPopup.alert({
                    title: 'Login Failure',
                    content: 'Authentication failed. Please check your username and password and ensure you are connected to the internet.'
                });
            });

    };

})

.controller('yourScansCtrl', function($scope, $rootScope, $state, userService, networkService, imageService, $ionicPopup, tokenService, scanService) {
    $rootScope.firstRun = false;
    var userDetails = userService.getUser();
    var email = userDetails.email;
    var password = userDetails.password;
    $scope.scans = userDetails.scans;
    $scope.loading = false;

    $scope.authError = function() {
        if (!$rootScope.noNetwork) {
            $ionicPopup.alert({
                title: 'Authentication Error',
                content: 'Login failed. Please check your username and password.'
            }).then(function() {
                $state.go('login');
            });
        };
    };


    $scope.getScans = function() {
        tokenService.getToken(email, password).then(function(token) {
            scanService.getScans(token).then(function(scans) {
                $scope.scans = scans;
            }, function(error) {
                if (!$rootScope.noNetwork) {
                    $ionicPopup.alert({
                        title: 'Server Error',
                        content: 'Please try again in a few minutes. If this problem persists please contact ScreenLab.'
                    });
                };
            });

        }, function(error) {
            $scope.authError();
        });
    };
    $scope.getScans();
    $scope.newPhoto = function() {
        $scope.loading = true;
        tokenService.getToken(email, password).then(function(token) {
            imageService.getImage().then(function(imageData) {
                scanService.postScan(token, imageData).then(function(scanData) {
                    $state.go('scanName', {
                        "scan": scanData
                    });
                    setTimeout(function () {$scope.loading=false;}, 2000);
                }, function(error) {
                    if (!$rootScope.noNetwork) {
                        $ionicPopup.alert({
                            title: 'Server Error',
                            content: 'Please try again in a few minutes. If this problem persists please contact ScreenLab.'
                        });
                    };
                    $scope.loading = false;
                });

            }, function(error) {
                $ionicPopup.alert({
                    title: 'Camera Error',
                    content: 'Failed to load camera app. Please contact ScreenLab.'
                });
                $scope.loading = false;
            });
        }, function(error) {
            $scope.authError();
            $scope.loading = false;
        });
    };

    $scope.doRefresh = function() {
        tokenService.getToken(email, password).then(function(token) {
            scanService.getScans(token).then(function(scans) {
                $scope.scans = scans;
                $scope.$broadcast('scroll.refreshComplete');
            }, function(error) {
                $scope.$broadcast('scroll.refreshComplete');
                if (!$rootScope.noNetwork) {
                    $ionicPopup.alert({
                        title: 'Server Error',
                        content: 'Please try again in a few minutes. If this problem persists please contact ScreenLab.'
                    });
                };
            });
        }, function(error) {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.authError();
        });
    $scope.showUrlPopup = function() {
        $scope.data = {}
        $ionicPopup.show({
        //template: 'templates/urlForm.html',
        title: 'Enter scan details',
        scope: $scope,
        buttons: [
            { text: 'Cancel' },
            {
                text: '<b>Save</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.data.url) {
                        //don't allow the user to close unless he enters wifi password
                        e.preventDefault();
                    } else {
                        return $scope.data.url;
                    }
                }
            }
        ]
    });
    };
    
    };


    $scope.scanDetail = function(scan) {
        $scope.getScans();
        $state.go('scanName', {
            "scan": scan
        });

    };

})

.controller('scanNameCtrl', function($scope, $state, $stateParams, networkService) {
    $scope.scan = $stateParams.scan;


})
