angular.module('starter').controller('signupCtrl', function($scope, md5, $state, client, $ionicPopup){

	$scope.signupData = {
		username: "",
		password: "",
		passwordRepeat: "",
		isChecked: false
	};

	showAlert = function(message){
		var alertPopup = $ionicPopup.alert({
			title: 'Attention...',
			template: message
		});
	}

	$scope.turnTologin = function(){
		$state.go('login');
	}

	$scope.signup = function(){
		console.log("trying to sing up "+ $scope.signupData.username);
		if(!$scope.signupData.isChecked){
			 console.log("signup failed, accept terms and conditions first!");
			 showAlert('signup failed, accept terms and conditions first!');
			 return;
		 };

		//  todo: Check validity of email

		if($scope.signupData.password != $scope.signupData.passwordRepeat){
			console.log("The two password do not match");
			showAlert('The two password do not match');
			return;
			};

		if($scope.signupData.password.$error){
			console.log("size of the password too short");
			showAlert('size of the password too short');
			return;
		};

		console.log("all correct locally, checking if email is present in the system...");
		//TODO: Use a randomly generated salt every time!

		var emailPromise =  client.isEmailUnique($scope.signupData.username)
		console.log(emailPromise);
			emailPromise
				.then(
					//success
					function(){
						//If the email is unique on the server, go on saving data.
						client.signup($scope.signupData, function(response){
							if(response){
								console.log('online signup successful, saving data on your phone...');
								window.localStorage.setItem($scope.signupData.username, md5.createHash($scope.signupData.password));
								console.log("signup process successful");
								return;
							}
							else{
								console.log('signup failed, retry later');
								return;
							}
						});
					},
					//failure
					function(){
						console.log('email is already present');
						showAlert('email is already present');
						return;
					}
				);
		};
})
