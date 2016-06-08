angular.module('app.controllers', [])

// The login controller interfaces between the userService and the 
// login page. When a login attempt is made the controller checks
// with the server to ensure the details are valid and a token is
// returned.

.controller('loginCtrl', function (userService, networkService, $rootScope, $scope, $ionicPopup, $state) {
    var userDetails = userService.getUser();
    if (angular.isUndefined($rootScope.firstRun) && userDetails.email !== null) {
        $state.go('yourScans');
    }
    $scope.email = userDetails.email;
    $scope.password = userDetails.password;
    
    // Login function to verify user details and then save them if they
    // are authenticated.
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

// The scan list controller. Includes getting and refreshing the scan list,
// passing a photo to be scanned and submitting a URL for scanning.
.controller('yourScansCtrl', function ($scope, $rootScope, $state, userService, networkService, imageService, $ionicModal, $ionicPopup, tokenService, scanService) {
    $rootScope.firstRun = false;
    var userDetails = userService.getUser();
    var email = userDetails.email;
    var password = userDetails.password;
    $scope.scans = userDetails.scans;
    $scope.loading = false;

    // Set up a modal for submitting new URLs to scan.
    $scope.data = {};
    $ionicModal.fromTemplateUrl('templates/urlForm.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.hideModal = function () {
        $scope.data = {};
        $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });

    // General error pop-up for use when authentication fails in any of the
    // other functions below.
    $scope.authError = function () {
        if (!$rootScope.noNetwork) {
            $ionicPopup.alert({
                title: 'Authentication Error',
                content: 'Login failed. Please check your username and password.'
            }).then(function () {
                $state.go('login');
            });
        }
    };
    
    // Fetch existing scans for the current user from the server. This requires a token
    // first then the service request to retrieve the scan data as a JSON object.
    // Gracefully handle failures with notification.
    $scope.getScans = function () {
        tokenService.getToken(email, password).then(function (token) {
            scanService.getScans(token).then(function (scans) {
                $scope.scans = scans;
            }, function (error) {
                if (!$rootScope.noNetwork) {
                    $ionicPopup.alert({
                        title: 'Server Error',
                        content: 'Please try again in a few minutes. If this problem persists please contact ScreenLab.'
                    });
                }
            });
        }, function (error) {
            $scope.authError();
        });
    };

    // Get a token, take a photo and submit the photo for processing.
    $scope.newPhoto = function () {
        // Turn on the loading screen.
        $scope.loading = true;
        
        // Get a token then use the default camera app to get an image.
        tokenService.getToken(email, password).then(function (token) {
            imageService.getImage().then(function (imageData) {
                scanService.postScan(token, imageData).then(function (scanData) {
                    // Pass the scan results to the detailed scan page.
                    $state.go('scanName', {
                        "scan": scanData
                    });
                    setTimeout(function () {
                        $scope.loading = false;
                    }, 2000);
                }, function (error) {
                    if (!$rootScope.noNetwork) {
                        $ionicPopup.alert({
                            title: 'Server Error',
                            content: 'Please try again in a few minutes. If this problem persists please contact ScreenLab.'
                        });
                    }
                    $scope.loading = false;
                });
            }, function (error) {
                $ionicPopup.alert({
                    title: 'Camera Error',
                    content: 'Failed to load camera app. Please contact ScreenLab.'
                });
                $scope.loading = false;
            });
        }, function (error) {
            $scope.authError();
            $scope.loading = false;
        });
    };

    // Collect a URL and device type from the user in a modal and then submit
    // to the API.
    $scope.newUrl = function (data) {
        $scope.modal.hide();
        // Show the loading screen
        $scope.loading = true;
        // Start with a token, then post the URL and device type as the data object.
        tokenService.getToken(email, password).then(function (token) {
            scanService.postUrl(token, data).then(function (scanData) {
                $state.go('scanName', {
                    "scan": scanData
                });
                setTimeout(function () {
                    $scope.loading = false;
                }, 2000);
            }, function (error) {
                if (!$rootScope.noNetwork) {
                    $ionicPopup.alert({
                        title: 'Connection Error',
                        content: 'Please check that you typed the URL correctly and that it includes http://'
                    });
                }
                $scope.loading = false;
            });
        }, function (error) {
            $scope.authError();
            $scope.loading = false;
        });
        $scope.data = {};
    };
    
    // Pull down to refresh the scan list.
    $scope.doRefresh = function () {
        // Get a token first, then request scans from the server.
        tokenService.getToken(email, password).then(function (token) {
            scanService.getScans(token).then(function (scans) {
                $scope.scans = scans;
                // Tell ionic the refresh is finished
                $scope.$broadcast('scroll.refreshComplete');
            }, function (error) {
                // Tell ionic the refresh is finished
                $scope.$broadcast('scroll.refreshComplete');
                if (!$rootScope.noNetwork) {
                    $ionicPopup.alert({
                        title: 'Server Error',
                        content: 'Please try again in a few minutes. If this problem persists please contact ScreenLab.'
                    });
                }
            });
        }, function (error) {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.authError();
        });
    };

    // Get the details for the selected scan and pass ot the details state.
    $scope.scanDetail = function (scan) {
        $scope.getScans();
        $state.go('scanName', {
            "scan": scan
        });
    };
    
    // Load the scans when first arriving at this state.
    $scope.getScans();
})

// The controller for the scan details page. Simply takes the scan parameters
// passed in and applies them to the scope.
.controller('scanNameCtrl', function ($scope, $state, $stateParams, networkService) {
    $scope.scan = $stateParams.scan;
});
