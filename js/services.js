angular.module('app.services', [])

// tokenService:
// This service takes your ScreenLab email and password to authenticate and
// returns an access token. If it fails it will reject to be handled in the
// calling controller.
.factory('tokenService', function ($http, $q) {
    var obj = {};
    obj.getToken = function (email, password) {
        return $q(function (resolve, reject) {
            // This is the dev ScreenLab server.
            var postUrl = 'https://screenlab.io/api/auth/session';
            var postObject = {};
            postObject.email = email;
            postObject.password = password;

            $http({
                url: postUrl,
                method: "POST",
                data: JSON.stringify(postObject)
            }).then(function (response) {
                // Check if the response actually contains a token, in case the http post
                // reported success without returning the correct JSON array.
                if (!response || !response.data || !response.data.session || !response.data.session.accesstoken) {
                    reject();
                } else {
                    resolve(response.data.session.accesstoken);
                };
            }, function (err) {
                reject(err);
            });


        });
    };
    return obj;
})


// scanService:
// This service handles sending and receiving ScreenLab tests
// and results. 
.factory('scanService', function ($http, $q, $filter) {
    var obj = {};
    obj.postScan = function (token, imageData) {
        return $q(function (resolve, reject) {

            // This is the dev ScreenLab server.
            var postUrl = "https://screenlab.io/api/scan";

            var timeDate = new Date().toLocaleString();
            var postObject = new Object();
            postObject.name = "App " + timeDate;
            postObject.imageData = "data:image/jpeg;base64," + imageData;

            $http({
                url: postUrl,
                method: "POST",
                data: JSON.stringify(postObject),
                headers: {
                    'X-Accesstoken': token
                }
            }).then(function (res) {
                if (!res.data || !res.data.s3_image_link) {
                    reject();
                } else {
                    resolve(res.data);
                }
            });
        });
    };
    obj.postUrl = function (token, data) {
        return $q(function (resolve, reject) {

            // This is the dev ScreenLab server.
            var postUrl = "https://screenlab.io/api/scan";

            var timeDate = new Date().toLocaleString();
            var postObject = new Object();
            postObject.name = "App " + timeDate;
            postObject.testUrl = data.url;
            switch(data.deviceType){
                case "desktop":
                    postObject.width = 1280;
                    postObject.height = 800;
                    break;
                case "tablet":
                    postObject.width = 1024;
                    postObject.height = 768;
                    break;
                case "phone":
                    postObject.width = 375;
                    postObject.height = 667;
                    break;
            };
            $http({
                url: postUrl,
                method: "POST",
                data: JSON.stringify(postObject),
                headers: {
                    'X-Accesstoken': token
                }
            }).then(function (res) {
                if (!res.data || !res.data.s3_image_link) {
                    reject();
                } else {
                    resolve(res.data);
                }
            } , function (err) {
                reject(err);
            });
        });
    };
    obj.getScans = function (token) {
        return $q(function (resolve, reject) {
            var scansUrl = "https://screenlab.io/api/scans";
            $http({
                url: scansUrl,
                method: "GET",
                headers: {
                    'X-Accesstoken': token
                }
            }).then(function (res) {
                if (!res.data) {
                    window.localStorage.getItem("scans").then(function (scans) {
                        resolve(angular.toJson(scans));
                    }, function (error) {
                        reject();
                    })
                } else {
                    var sortScans = $filter('orderBy')(res.data, '-created');
                    window.localStorage.setItem("scans", angular.toJson(sortScans));
                    resolve(sortScans);    
                }
            }, function (error) {
                window.localStorage.getItem("scans").then(function (scans) {
                    resolve(angular.fromJson(scans));
                }, function (error) {
                    reject();
                });
            })
        });
    };
    return obj;
})



// imageService:
// This service gets a photo with the cordova camera plugin.
// It could be replaced with various alternative image sources
// that return a base 64 encoded image.
.factory('imageService', function ($cordovaCamera) {
    var obj = {};
    obj.getImage = function () {
        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: 1,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 1280,
            targetHeight: 1280,
            correctOrientation: 1,
            saveToPhotoAlbum: false
        };
        return $cordovaCamera.getPicture(options);
    };
    return obj;
})

.factory('networkService', function($cordovaNetwork,$rootScope){
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
        $rootScope.noNetwork = false;
    });
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
        $rootScope.noNetwork = true;
    });
    return {};
})

// userService: 
// Allows verification of user details, saving user information for next
// login and retrieving saved user information.
.factory('userService', function (tokenService, $q) {
    var obj = {};
    obj.verify = function (email, password) {
        return $q(function (resolve, reject) {
            tokenService.getToken(email, password).then(function (response) {
                resolve();
            }, function (error) {
                reject(error);
            });
        });
    };
    obj.getUser = function () {
        return {
            "email": window.localStorage.getItem("email"),
            "password": window.localStorage.getItem("password"),
            "scans": angular.fromJson(window.localStorage.getItem("scans"))
        };
    };
    obj.saveUser = function (email, password) {
        window.localStorage.setItem("email", email);
        window.localStorage.setItem("password", password);
    };
    return obj;
})
