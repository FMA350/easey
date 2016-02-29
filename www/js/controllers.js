angular.module('starter.controllers', [])

// With the new view caching in Ionic, Controllers are only called
// when they are recreated or on app start, instead of every page change.
// To listen for when this page is active (for example, to refresh data),
// listen for the $ionicView.enter event:
//$scope.$on('$ionicView.enter', function(e) {
//});

.controller('LoginCtrl', function($scope, $ionicModal, md5, $state) {
  // Form data for the login model
  $scope.loginData = {};

	$scope.onDragRight = function() {
		$state.go('signup');
	}

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login for', $scope.loginData.username);
		// gather information on the localStorage and try to fetch data from the website
		if(localLogin($scope.loginData.username, $scope.loginData.password)||
		remoteLogin($scope.loginData.username, $scope.loginData.password)){
			console.log("login successful!")
			return;
			// $state.go('overview');
		}
		// TODO: prompt an error message to the user
		console.log("could not login");
  };

	localLogin = function(usernameL, passwordL){
		//fetch password form localStorage
		// TODO: upgrade to SQlite
		// TODO: Use a Hash to store/fetch the password
			if(md5.createHash(passwordL) === window.localStorage.getItem(usernameL)){
				return true;
			}
			return false;
	};

	remoteLogin = function(usernameL, passwordL){
		return false;
	}
	FacebookLogin = function(){
		// TODO: check for a tocken on the phone first
		// TODO: connect to facebook apis
		return false;
	}
})

.controller('signupCtrl', function($scope, $ionicModal, md5, $state){

	$scope.signupData = {
		username: "",
		password: "",
		passwordRepeat: "",
		isChecked: false
	};

	$scope.onSwipeLeft = function() {
		$state.go('login');
	}

	$scope.signup = function() {
		console.log("trying to sing up "+ $scope.signupData.username);
		// TODO: check if username has already been used
		if(!$scope.signupData.isChecked){
			 console.log("signup failed, accept terms and conditions first!");
			 return;
		 };

		//  todo: Check validity of email

		if($scope.signupData.password != $scope.signupData.passwordRepeat){
			console.log("The two password do not match");
					return;
			};

		if($scope.signupData.password.$error){
				console.log("size of the password too short");
				return;
			}
			console.log("all correct, saving...");
			//TODO: Use a randomly generated salt every time!

					window.localStorage.setItem($scope.signupData.username, md5.createHash($scope.signupData.password));
			console.log("signup process successful")
	};



});
