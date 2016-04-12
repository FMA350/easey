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
			var temp = storage.getFriends();
			console.log(temp);
			var toReturn = new Array(temp.length);
			for (var index = 0; index < temp.length; index++){
				toReturn[index] = {};
				// toReturn[index].email = temp[index].email;
				// toReturn[index].nickname = temp[index].nickname;
				 toReturn[index].email = temp[index];
				 toReturn[index].nickname = temp[index];
				toReturn[index].choosen = false;
			}
			console.log(toReturn);
			return toReturn;
		};

		$scope.accept = function(index){
			storage.saveFriend($scope.requests[index], $scope.requests[index]);
			console.log('request= '+ $scope.requests[index])
			client.answerFriendRequest($scope.requests[index], currentUser, true, function(answer){
					console.log(answer);
					$scope.requests.splice(index, 1);
					$state.go($state.current, {}, {reload: true});
					return;
			});
		}

		$scope.refuse = function(index){
			client.answerFriendRequest($scope.requests[index], currentUser, false, function(answer){
				$scope.requests.splice(index, 1);
				$state.go($state.current, {}, {reload: true});
				console.log(answer);
				return;
			});
		}

		$scope.removeEvent = function(index){
				storage.removeEvent(index);
				$scope.calendarEvents = storage.getEvents();
				return;
		}

		$scope.pendingEventAccept = function(index, accept){
			if(accept){
				//accept the event, move it to local storage, add it to normal events and delete it on the server
				var newEvent = {};
				console.log($scope.pendingEvents[index].friends);
				console.log($scope.pendingEvents[index].location);
				newEvent.name 	 = 	$scope.pendingEvents[index].name;
				newEvent.date    = 	$scope.pendingEvents[index].date;
				newEvent.share   = 	$scope.pendingEvents[index].share;
				newEvent.friends = 	$scope.pendingEvents[index].friends;
				newEvent.location = $scope.pendingEvents[index].location;
				console.log(newEvent);
				storage.saveEvent(newEvent);
				client.saveEvent(newEvent);
				client.deletePendingEvent(currentUser, $scope.pendingEvents[index]);
				$scope.pendingEvents.splice(index, 1);
			}
			else{
				//delete event from pending
				client.deletePendingEvent(currentUser, $scope.pendingEvents[index]);
				$scope.pendingEvents.splice(index, 1);
				console.log('pending event deleted!')
			}
		}

		pickFriends = function(){
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
						 $scope.calendarEvent.friends = pickFriends();
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
										 storage.saveEvent(storage.postprocessingEvent($scope.calendarEvent));
										 client.saveEvent($scope.calendarEvent);
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
							client.sendFriendRequest(currentUser ,$scope.newFriend.email, $scope.newFriend.message, function(response){
								console.log(response);
							});
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
				client.getPendingEvents(currentUser, function(data){
					$scope.pendingEvents = data;
				})
				client.getFriends(currentUser, function(data){
					storage.saveFriends(data);
					$scope.friends = loadFriends();
				})
				client.getFriendRequests( localStorage.getItem('currentUser'), function(requests){
					$scope.requests = requests;
					console.log(requests);
				});

});
