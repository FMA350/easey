angular.module('starter').controller('LoginCtrl', function($scope, md5, $state, $ionicPopup) {
  // Form data for the login model
	//TODO: move this to logout functionality
	window.localStorage.setItem("currentUser", "")
  $scope.loginData = {};

	$scope.turnToSignup = function() {
		$state.go('signup');
	}

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login for', $scope.loginData.username);
		// gather information on the localStorage and try to fetch data from the website
		if(localLogin($scope.loginData.username, $scope.loginData.password)){
			console.log("login successful!")
			$state.go('overview');
			return true;
		}else{
		   if(remoteLogin($scope.loginData.username, $scope.loginData.password)){
			console.log("login successful!")
			$state.go('overview');
			return true;
			}
			console.log("could not login");
				var alertPopup = $ionicPopup.alert({
						title: 'Login failed',
						template: 'Could not login in Easey, are you sure you have an account?'
						});
			return false;
		}
	};

	localLogin = function(usernameL, passwordL){
		//fetch password form localStorage
		// TODO: upgrade to SQlite
		// TODO: Use a Hash to store/fetch the password
			if(md5.createHash(passwordL) === window.localStorage.getItem(usernameL)){
				window.localStorage.setItem("currentUser", usernameL)
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
	};
	})
