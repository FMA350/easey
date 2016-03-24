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
			console.log($scope.dayView.hourDates[i]);
		}
		console.log($scope.dayView.hourDates[i]);
		$scope.dayView.newEventDate = $scope.dayView.date;

	}

	loadEvents = function(){
		return localStorage[localStorage.getItem("currentUser")+"/Events"] ? JSON.parse(localStorage[localStorage.getItem("currentUser")+"/Events"]) : [];
	};

	removeDisplayedEvents = function(){
			angular.element(document.getElementsByClassName("toBeRemoved")).remove();
	}

	displayEvents = function(){
		// TODO: Improve the way events are stored.
		for(var i = 0; i < events.length; i++){
			console.log(events[i]);

			events[i].date = new Date(events[i].date)
			console.log(events[i].date);

			$scope.dayView.date = new Date($scope.dayView.date);
			console.log($scope.dayView.date);

			 if(events[i].date.getFullYear() === $scope.dayView.date.getFullYear()){
					console.log("YEAR OK");
				if(events[i].date.getMonth() === $scope.dayView.date.getMonth()){
										console.log("month OK");
					if(events[i].date.getDate() === $scope.dayView.date.getDate()){
						console.log("Displaying an element!");
						var eventHour = events[i].date.getHours();
						var timetableElement = angular.element(document.getElementById(eventHour));
						console.log(timetableElement);
					  timetableElement.append("<a class='toBeRemoved' style='button button-assertive'>"+events[i].name+" </a>");
					}
				}
		  }
		}
	};

	$scope.gotoOverview = function(){
		$state.go('overview');
	};

	$scope.gotoWeekView = function(){
		$state.go('weekView');
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
						 events = loadEvents();
						 removeDisplayedEvents();
						 displayEvents();
					 }
				 }
				]
			});
	};

	$scope.addEvent = function(inputDate){
		console.log(inputDate);
		$scope.dayView.messageHour = "Hour: ";
		$scope.dayView.newEventDate = inputDate;
	};

// ON BOOTSTRAP
setHourDates();
events = loadEvents();
displayEvents();

});
