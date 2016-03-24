angular.module('starter').controller('weekViewCtrl', function($scope, md5, $state, $ionicPopup ,client){

	$scope.weekView = {};
	$scope.weekView.weekDays = [];
	$scope.weekView.today = new Date();



	// Service VARIABLES
	// weekday array will be used to display the days of the week
	$scope.weekdays = new Array(7);
		$scope.weekdays[0]=  "Sunday";
		$scope.weekdays[1] = "Monday";
		$scope.weekdays[2] = "Tuesday";
		$scope.weekdays[3] = "Wednesday";
		$scope.weekdays[4] = "Thursday";
		$scope.weekdays[5] = "Friday";
		$scope.weekdays[6] = "Saturday";


	$scope.showDatePicker = function(){
		var oldDate = $scope.weekView.today;
		var addEventPopup = $ionicPopup.show({
				templateUrl: 'templates/popups/datePickerPopup.html',
				title: 'Choose a date',
				scope: $scope,
				buttons: [
					{text: 'Cancel',
					type: 'button-assertive button-clear',
					onTap: function(e){
						$scope.weekView.today = oldDate;
					}
				},
					{text: 'Save',
					 type: 'button-positive button-outline',
					 onTap: function(e){
						 setHourDates();
						 events = loadEvents();
						 removeDisplayedEvents();
						 displayEvents();
					 }
				 }
				]
			});
	};


	loadEvents = function(){
		return localStorage[localStorage.getItem("currentUser")+"/Events"] ? JSON.parse(localStorage[localStorage.getItem("currentUser")+"/Events"]) : [];
	};

	$scope.gotoDayView = function(){
		$state.go('dayView');
	};
	$scope.gotoOverview = function(){
		$state.go('overview');
	};



});
