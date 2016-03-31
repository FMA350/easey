angular.module('starter').controller('overviewCtrl', function($scope, $ionicPopup, $state, client, storage){
	// PAGE VARIABLES
		$scope.binView = false;

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

		loadFriends = function(){
			//get friends and process them to fit the view
			temp = storage.getFriends();
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
				storage.saveEvents($scope.calendarEvents);
				return;
		}
		//
		// getPendingEvents = function(socket){
		// 	socket.on("pendingEvents", function(newEvents){
		// 		console.log(newEvents);
		// 		// socket.emit('pendingEventsSaved');
		// 		return newEvents;
		// 	});
		//
		// 	socket.on('noEvents', function(){
		// 		console.log("nothing to synchronize");
		// 		return [];
		// 	});
		// };
		//
		// saveEvents = function(calendarEvents){
		// 	for(calendarEvent in calendarEvents){
		// 		saveEvent(calendarEvent);
		// 	}
		// }
		//
		// saveEvent = function(calendarEvent){
		// 	calendarEvent = postprocessingEvent(calendarEvent);
		//
		// 	var calendarEvents = storage.getEvents();
		// 	console.log(calendarEvents);
		// 	storage.addToArray(calendarEvent, calendarEvents, function(newArray){
		// 		 storage.orderLastEvent(newArray, function(ordered){
		// 			 storage.saveEvents(ordered);
		// 		 });
		// 	});
		// };


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
										 storage.saveEvent($scope.calendarEvent);
										 //clear the $scope.calendarEvent
										 $scope.calendarEvent = {};
										 //Reload events
										 $scope.calendarEvents = storage.getEvents();
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
							storage.addContact($scope.newFriend.nickname, $scope.newFriend.email);
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
				$scope.calendarEvents = storage.getEvents();
				$scope.friends = loadFriends();
});
