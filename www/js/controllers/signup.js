angular.module('starter').controller('signupCtrl', function($scope, md5, $state){

	//GLOBAL VARIABLES AND CONSTANTS
	const PORT = 34237; //easey leet
	const SERVER_ADDRESS ="localhost:"+PORT;

	$scope.signupData = {
		username: "",
		password: "",
		passwordRepeat: "",
		isChecked: false
	};

	onlineSignup = function(){
		var socket = io.connect(SERVER_ADDRESS);
		socket.on('connect',function(){
			console.log("connetion with the server...");
			var toSend = {};
				toSend.email = $scope.signupData.username;
				toSend.username = $scope.signupData.username;
				toSend.password = md5.createHash($scope.signupData.password);

			socket.emit('signup',toSend);
			return;
		})

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
			console.log("all correct, saving...");
			//TODO: Use a randomly generated salt every time!
			window.localStorage.setItem($scope.signupData.username, md5.createHash($scope.signupData.password));
			onlineSignup();

			console.log("signup process successful")
	};
})
