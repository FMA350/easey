angular.module('starter.controllers', [])

// With the new view caching in Ionic, Controllers are only called
// when they are recreated or on app start, instead of every page change.
// To listen for when this page is active (for example, to refresh data),
// listen for the $ionicView.enter event:
//$scope.$on('$ionicView.enter', function(e) {
//});

.controller('LoginCtrl', function($scope, md5, $state) {
  // Form data for the login model
	//TODO: move this to logout functionality
	window.localStorage.setItem("currentUser", "")
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
			$state.go('overview');
			return true;
		}

		// TODO: prompt an error message to the user
		console.log("could not login");
		return false;
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
	}
})

.controller('signupCtrl', function($scope, md5, $state){

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
})

.controller('overviewCtrl', function($scope, $ionicPopup, $state){
		var currentUser = localStorage.getItem("currentUser");
		$scope.calendarEvent = {};
		$scope.calendarEvents = [];

//TODO: encrypt all the events.



		loadEvents = function(){
			// console.log(JSON.parse(localStorage[currentUser+"/Events"]));
			return localStorage[currentUser+"/Events"] ? JSON.parse(localStorage[currentUser+"/Events"]): [];
		}

		saveEvent = function(calendarEvent){
			//TODO: do checks/postprocessing
				calendarEvents = JSON.parse(localStorage.getItem(currentUser+"/Events"));
    			if(calendarEvents === null) calendarEvents = new Array();
					if(!angular.isArray(calendarEvents)) {
						var old = calendarEvents;
						calendarEvents = new Array();
						calendarEvents[0] = old;
					}
				calendarEvents.push(calendarEvent);
				console.log(calendarEvents);
    		localStorage.setItem(currentUser+"/Events",JSON.stringify(calendarEvents));
		};

		$scope.showAddEventPopup = function(){
			var addEventPopup = $ionicPopup.show({
				templateUrl: 'templates/eventPopupOne.html',
				title: 'Add an event',
				scope: $scope,
				buttons: [
					{text: 'Cancel',
					 type: 'button-assertive button-clear'},
					{text: 'Next',
					 type: 'button-positive button-outline',
				 	 onTap: function(e){
						 var name = $scope.calendarEvent.name ? $scope.calendarEvent.name : "Untitled"
						 var secondPopup = $ionicPopup.show({
							 templateUrl: 'templates/eventPopupTwo.html',
						 		title: name,
								scope: $scope,
								buttons: [
									{text: 'Cancel',
									type: 'button-assertive button-clear'},
									{text: 'Save',
									 type: 'button-positive button-outline',
									 onTap: function(e){
										 console.log($scope.calendarEvent);
										 saveEvent($scope.calendarEvent);
										 //clear the $scope.calendarEvent
										 $scope.calendarEvent = {};
										 //Reload events
										 $scope.calendarEvents = loadEvents();
									 }

									 }
								]
						 });
					 }
				 }
				]
			});
		};
				//Execution on load.
				$scope.calendarEvents = loadEvents();
				console.log($scope.calendarEvents)
				if($scope.calendarEvents.length === 0 ){
					console.log("no events!")
				};

});
