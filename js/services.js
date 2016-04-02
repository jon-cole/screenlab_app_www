angular.module('app.services', [])

// tokenService:
// This service takes your ScreenLab email and password to authenticate and
// returns an access token. If it fails it will reject to be handled in the
// calling controller.
.factory('tokenService', function ($http, $q) {
    var getToken = function (email, password) {
        return $q(function (resolve, reject) {

            // This is the dev ScreenLab server.
            var postUrl = "http://162.243.110.9/api/auth/session";

            var postObject = new Object();
            postObject.email = email;
            postObject.password = password;

            $http.post(postUrl, postObject).then(function (res) {
                var response = res;
            }, function (err) {
                reject();
            });

            // Check if the response actually contains a token, in case the http post
            // reported success without returning the correct JSON array.
            if (!response || !response.data || !response.data.session || !response.data.session.accesstoken) {
                reject();
            } else {
                resolve(response.data.session.accesstoken);
            };
        });
    };

});


// scanService:
// This service takes your image data and submits it for processing,
// authorising with your API token. It returns the JSON from the API
// with the image link and scores. 
.factory('scanService', function ($http, $q) {
    var postScan = function (token, imageData) {
        return $q(function (resolve, reject) {

            // This is the dev ScreenLab server.
            var postUrl = "http://162.243.110.9/api/scan";

            var timeDate = new Date().toLocaleString();
            var postObject = new Object();
            postObject.name = "App " + timeDate;
            postObject.imageData = "data:image/jpeg;base64," + imageData;

            $http({
                url: postUrl,
                method: "POST",
                data: scanObject,
                headers: {
                    'X-Accesstoken': token
                }
            }).then(function (res) {
                if (!res.data || !res.data.s3_image_link) {
                    resolve(res.data);
                } else {
                    reject();
                }
            });
        });
    }
});



// imageService:
// This service gets a photo with the cordova camera plugin.
// It could be replaced with various alternative image sources
// that return a base 64 encoded image.
.factory('imageService', function ($cordovaCamera) {
    var getImage = function () {
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
    }
});



// userService: 
// Allows verification of user details, saving user information for next
// login and retrieving saved user information.
.factory('userService', function (tokenService, $q) {
    var verify = function (email, password) {
        return $q(function (resolve, reject) {
            tokenService.getToken(email, password).then(function (response) {
                resolve();
            }, function (error) {
                reject();
            });
        });
    };
    var getUser = function () {
        return (window.localStorage.getItem("email"), window.localStorage.getItem("password"));
    };
    var saveUser = function (email, password) {
        window.localStorage.setItem("email", email);
        window.localStorage.setItem("password", password);
    };

});
