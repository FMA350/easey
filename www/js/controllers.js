angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $ionicModal, $timeout, $state) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};


	$scope.onSwipeRight = function() {
		$state.go('signup');
	}

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login for', $scope.loginData.username);
		// gather information on the localStorage and try to fetch data from the website
		if(localLogin){
			//TODO: grant access
		}

  };

	localLogin = function(usernameL, passwordL){
		//fetch password form localStorage
		// TODO: upgrade to SQlite
		// TODO: Use a Hash to store/fetch the password
			if(passwordL === window.localStorage['usernameL']){
				return true;
			}
			return false;
	};

	FacebookLogin = function(){
		// TODO: check for a tocken on the phone first
		// TODO: connect to facebook apis
		return false;
	}
})

.controller('signupCtrl', function($scope, $ionicModal, $timeout, $state){
	$scope.onSwipeLeft = function() {
		$state.go('login');
	}



});
