angular.module('starter').controller('dayViewCtrl', function($scope, md5, $state, $ionicPopup){



	$scope.dayView = {};
	$scope.dayView.date = new Date();
	$scope.dayView.date.setHours(0);
	$scope.dayView.date.setMinutes(0);
	$scope.dayView.date.setSeconds(0);
	$scope.dayView.hourDates = [];

	$scope.dayView.header = "Add a new Event by clicking on the choosen time slot, or swipe for awesome suggestions!";
	$scope.dayView.newEventDate;

	var events = [];

	setHourDates = function(){
		for(var i = 0; i < 24; i++){
			$scope.dayView.hourDates[i] = $scope.dayView.date;
			$scope.dayView.hourDates[i] = $scope.dayView.hourDates[i].setHours(Number(i));

		}
		$scope.dayView.newEventDate = $scope.dayView.date;
	}

	loadEvents = function(){
		return localStorage[localStorage.getItem("currentUser")+"/Events"] ? JSON.parse(localStorage[localStorage.getItem("currentUser")+"/Events"]) : [];
	};

	displayEvents = function(){
		// TODO: Improve the way events are stored.
		for(var i = 0; i < events.length; i++){
			console.log(events[i]);
			events[i].date = new Date();
			 if(events[i].date.getFullYear === $scope.dayView.date.getFullYear){
					console.log("YEAR OK");
				if(events[i].date.month() === $scope.dayView.date.month()){
										console.log("month OK");
					if(events[i].date.date() === $scope.dayView.date.date()){
						console.log("Displaying an element!");
						var eventHour = events[i].date.hours();
						var appentAt = document.getElementById('timetable');
						appendAt.append("<p>Test</p>");
					}
				}
			// }
		}
	}

	$scope.gotoOverview = function(){
		$state.go('overview');
	};

	$scope.showDatePicker = function(){
		var oldDate = $scope.dayView.date;
		var addEventPopup = $ionicPopup.show({
				templateUrl: 'templates/popups/datePickerPopup.html',
				title: 'Choose a date',
				scope: $scope,
				buttons: [
					{text: 'Cancel',
					type: 'button-assertive button-clear',
					onTap: function(e){
						$scope.dayView.date = oldDate;
					}
				},
					{text: 'Save',
					 type: 'button-positive button-outline',
					 onTap: function(e){
						 setHourDates();
						 displayEvents();
					 }
				 }
				]
			});
	};

	$scope.addEvent = function(inputDate){
		console.log(inputDate);

		$scope.dayView.messageHour = "Hour: "
		$scope.dayView.newEventDate = inputDate;
	}

// ON BOOTSTRAP
setHourDates();
events = loadEvents();
displayEvents();

});
