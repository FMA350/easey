angular.module('starter').controller('signupCtrl', function($scope, md5, $state, client){

	//GLOBAL VARIABLES AND CONSTANTS
	const PORT = 34237; //easey leet
	const SERVER_ADDRESS ="localhost:"+PORT;

	$scope.signupData = {
		username: "",
		password: "",
		passwordRepeat: "",
		isChecked: false
	};

	$scope.turnTologin = function() {
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
		console.log("all correct locally, checking if email is present in the system...");
		//TODO: Use a randomly generated salt every time!
		if(client.isEmailUnique($scope.signupData.username)){
			if(client.signup($scope.signupData)){
				console.log('online signup successful, saving data on your phone...')
				window.localStorage.setItem($scope.signupData.username, md5.createHash($scope.signupData.password));
			}
			else{
				console.log('signup failed, retry later');
				return;
			}
		}
		else{
			// TODO: print error, email was already used
			console.log('email is already present');
			return;
		}
			console.log("signup process successful");
			return;
	};
})
