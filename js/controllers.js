angular.module('app.controllers', [])
  
.controller('loginCtrl', function(userService, $scope) {
	$scope.email, $scope.password = userService.getUser();
	
	$scope.login = function() {
			userService.verify($scope.email, $scope.password)
			.then(function(){
					userService.saveUser();
				},function(){
					
				});
			
	};

})
   
.controller('yourScansCtrl', function($scope) {

})
   
.controller('scanNameCtrl', function($scope) {

})
 
