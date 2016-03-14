angular.module('starter').controller('overviewCtrl', function($scope, $ionicPopup, $state){
	// PAGE VARIABLES
		$scope.binView = false;

		// BACKEND VARAIBLES (TODO: Move in a service)
		var currentUser = localStorage.getItem("currentUser");
		$scope.calendarEvent = {};
		$scope.calendarEvents = [];
		//GLOBAL VARIABLES AND CONSTANTS
		const PORT = 34237; //easey leet
		const SERVER_ADDRESS ="localhost:"+PORT;

		//TODO: encrypt all the events.

		$scope.toggleBinView = function(){
			$scope.binView = !$scope.binView;
		}

		$scope.gotoDayView = function(){
			$state.go('dayView');
		}

		saveCalendarEvents = function(calendarEvents){
			// Save current calendarEvents in the local storage
				localStorage.setItem(currentUser+"/Events",JSON.stringify(calendarEvents));
		};

		loadEvents = function(){
			// console.log(JSON.parse(localStorage[currentUser+"/Events"]));
			return localStorage[currentUser+"/Events"] ? JSON.parse(localStorage[currentUser+"/Events"]) : [];
		};

		$scope.removeEvent = function(index){
			console.log("removeEvent active");
			if(($scope.calendarEvents.length > 0)&&($scope.calendarEvents.length > index)){
				$scope.calendarEvents.splice(index, 1);
				saveCalendarEvents($scope.calendarEvents);
				return;
			}
			console.log("calendarEvents is empty or smaller than index. Function cannot remove element: "+index+", array length: "+$scope.calendarEvents.length		)
		}

		postprocessingEvent = function(calendarEvent){
			// Adjust date
			if(calendarEvent.meridian === null){
				calendarEvent.meridian = false;
			}
			if(calendarEvent.meridian){
				var newHour = Number(calendarEvent.hour) + 12;
				calendarEvent.date.setHours(newHour);
			}else{
				calendarEvent.date.setHours(Number(calendarEvent.hour));
			}
			calendarEvent.date.setMinutes(0);
			calendarEvent.date.setSeconds(0);
			return calendarEvent;
		}

		serverSaveEvent = function(calendarEvent){
			var socket = io.connect(SERVER_ADDRESS);
			socket.on('connect',function(){
				console.log("connetion with the server, saving calendarEvent...");
				var toSend = {};
					toSend.username = currentUser;
					toSend.name = calendarEvent.name;
					toSend.date = calendarEvent.date;
					toSend.share = calendarEvent.share;
					toSend.friends = null;
					// TODO: add friends list

				socket.emit('saveEvent',toSend);
			})


		}

		saveEvent = function(calendarEvent){
			calendarEvent = postprocessingEvent(calendarEvent);
			var calendarEvents = loadEvents();
    	if(calendarEvents === null) calendarEvents = new Array();
			if(!angular.isArray(calendarEvents)) {
						var old = calendarEvents;
						calendarEvents = new Array();
						calendarEvents[0] = old;
					}
				calendarEvents.push(calendarEvent);
				console.log($scope.calendarEvents);
				saveCalendarEvents(calendarEvents);
				serverSaveEvent(calendarEvent);
				loadEvents();
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
