angular.module('starter').controller('LoginCtrl', function($scope, md5, $state, $ionicPopup, client) {
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
		}else{
			var loginPromise = client.login($scope.loginData.username, $scope.loginData.password);
			console.log(loginPromise);
			loginPromise
				.then(
					//success
					function(){
						console.log('login successful, adding local values');
						window.localStorage.setItem($scope.loginData.username, md5.createHash($scope.loginData.password));
						window.localStorage.setItem("currentUser", $scope.loginData.username);
						$state.go('overview');
					},
					//failure
					function(){
						console.log('login failed, server says wrong password');
						var alertPopup = $ionicPopup.alert({
								title: 'Login failed',
								template: 'Could not login in Easey, are you sure you have an account?'
								});
					}
				);
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

	FacebookLogin = function(){
		// TODO: check for a tocken on the phone first
		// TODO: connect to facebook apis
		return false;
	};
	})
