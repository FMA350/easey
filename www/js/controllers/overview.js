angular.module('starter').controller('overviewCtrl', function($scope, $ionicPopup, $state){
	// PAGE VARIABLES
		$scope.binView = false;

		// BACKEND VARAIBLES (TODO: Move in a service)
		var currentUser = localStorage.getItem("currentUser");
		$scope.calendarEvent = {};
		$scope.friends = [];
		//friends[i] = {email, nickname, choosen}
		$scope.newFriend = {};
		$scope.calendarEvents = [];

		//GLOBAL VARIABLES AND CONSTANTS
		const PORT = 34237; //easey leet
		const SERVER_ADDRESS ="easey.noip.me:"+PORT;

		//TODO: encrypt all the events.

		$scope.toggleBinView = function(){
			$scope.binView = !$scope.binView;
		}

		$scope.gotoDayView = function(){
			$state.go('dayView');
		}
		$scope.gotoWeekView = function(){
			$state.go('weekView');
		};

		saveCalendarEvents = function(calendarEvents){
			// Save current calendarEvents in the local storage
				localStorage.setItem(currentUser+"/Events",JSON.stringify(calendarEvents));
		};

		saveFriendsList = function(friends){
			localStorage.setItem(currentUser+"/Friends",JSON.stringify(friends));
		}

		loadEvents = function(){
			// console.log(JSON.parse(localStorage[currentUser+"/Events"]));
			return localStorage[currentUser+"/Events"] ? JSON.parse(localStorage[currentUser+"/Events"]) : [];
		};

		loadFriends = function(){
			var temp = localStorage[currentUser+"/Friends"] ? JSON.parse(localStorage[currentUser+"/Friends"]) : [];
			console.log(temp);
			var toReturn = new Array(temp.length);
			for (var index = 0; index < temp.length; index++){
				toReturn[index] = {};
				toReturn[index].email = temp[index].email;
				toReturn[index].nickname = temp[index].nickname;
				toReturn[index].choosen = false;
			}
			return toReturn;
		};

		$scope.removeEvent = function(index){
			console.log("removeEvent function called, passed index: "+index );
				$scope.calendarEvents.splice(index, 1);
				saveCalendarEvents($scope.calendarEvents);
				return;
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

		getPendingEvents = function(socket){
			socket.on("pendingEvents", function(newEvents){
				console.log(newEvents);
				// socket.emit('pendingEventsSaved');
				return newEvents;
			});
			socket.on('noEvents', function(){
				console.log("nothing to synchronize");
				return [];
			});
		};


		serverSaveEvent = function(calendarEvent){
			var socket = io.connect(SERVER_ADDRESS);
				console.log("connetion with the server, saving calendarEvent...");
				var toSend = {};
					toSend.username = currentUser;
					toSend.name = calendarEvent.name;
					toSend.date = calendarEvent.date;
					toSend.share = calendarEvent.share;
					if(calendarEvent.share === 'invite'){
						toSend.friends = calendarEvent.friends;
					}
					else{toSend.friends = null;}
				socket.emit('saveEvent',toSend);
				//receive events
				saveEvents(getPendingEvents(socket));
				return;
		}

		saveEvents = function(calendarEvents){
			for(calendarEvent in calendarEvents){
				saveEvent(calendarEvent);
			}
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

		saveNewContact = function(nickname, email){
			console.log(nickname + email);
			if($scope.friends === null) $scope.friends = new Array();
			if(!angular.isArray($scope.friends)) {
						var old = $scope.friends;
						$scope.friends = new Array();
						$scope.friends[0] = old;
					}
			toAdd = {};
			toAdd.nickname = nickname;
			toAdd.email		 = email;
		 	$scope.friends.push(toAdd);
			console.log("friends list: "+$scope.friends)
			saveFriendsList($scope.friends);
		}

		saveEventFriends = function(){
			console.log($scope.friends);
			var friends = [];
			for(var i = 0; i < $scope.friends.length; i++){
				console.log("in the $scope.friends for loop, iteration: "+i);
				console.log($scope.friends[i]);
				if($scope.friends[i].choosen){
					console.log("friend was choosen, "+$scope.friends[i].email);
					friends.push($scope.friends[i].email);
				}
			}
				return friends;
		};

		$scope.showAddEventPopup = function(){
			$scope.calendarEvent.friends = loadFriends();
			var addEventPopup = $ionicPopup.show({
				templateUrl: 'templates/popups/eventPopupOne.html',
				title: 'Add an event',
				scope: $scope,
				buttons: [
					{text: 'Cancel',
					 type: 'button-assertive button-clear'},
					{text: 'Next',
					 type: 'button-positive button-outline',
				 	 onTap: function(e){
						 $scope.calendarEvent.friends = saveEventFriends();
						 console.log($scope.calendarEvent.friends);
						 var name = $scope.calendarEvent.name ? $scope.calendarEvent.name : "Untitled"
						 var secondPopup = $ionicPopup.show({
							 templateUrl: 'templates/popups/eventPopupTwo.html',
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

		$scope.addFriendPopup = function(){
			var addFriendPopup = $ionicPopup.show({
				templateUrl: 'templates/popups/addFriendPopup.html',
				title: 'add a friend',
				scope: $scope,
				buttons: [
					{text: 'Cancel',
					 type: 'button-assertive button-clear'},
					{text: 'Save',
						type: 'button-positive button-outline',
						onTap: function(e){
							saveNewContact($scope.newFriend.nickname, $scope.newFriend.email);
							$scope.newFriend = {};
						}
					 }
				]
			});
		};

		$scope.showFriendsPopup = function(){
			var showFriendsPopup = $ionicPopup.show({
				templateUrl: 'templates/popups/showFriendsPopup.html',
				title: 'Your Friends',
				scope: $scope,
				buttons: [
					{text: 'ok',
					 type: 'button-positive button-clear'}
				]
			});
		};

		//Execution on load.
				$scope.calendarEvents = loadEvents();
				$scope.friends = loadFriends();
				console.log($scope.friends)
				if($scope.calendarEvents.length === 0 ){
					console.log("no events!")
				};

});
