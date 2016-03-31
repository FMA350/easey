angular.module('starter').service('storage',function(){
	const FRIENDS = '/Friends';
	const FRIENDS_REQUESTS = "/Friends/Requests";
	const FRIENDS_PENDING = "/Friends/Pending";
	const EVENTS = '/Events';
	const EVENTS_PENDING = '/Events/Pending';

	saveFriendRequests = function(requests){
		localStorage.setItem(localStorage.getItem("currentUser")+FRIENDS_REQUESTS ,JSON.stringify(requests));
	}

	getFriendRequests = function(){
		return localStorage.getItem(localStorage.getItem("currentUser")+ FRIENDS_REQUESTS) ? JSON.parse(localStorage.getItem(localStorage.getItem("currentUser")+ FRIENDS_REQUESTS)) : [];
	}

	postprocessingEvent = function(calendarEvent){
		var toReturn = {}
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
		//remove unused VARIABLES
		toReturn.date = Number(calendarEvent.date);
		toReturn.name = calendarEvent.name;
		toReturn.share = calendarEvent.share;
		toReturn.friends = calendarEvent.friends;
		toReturn.location = calendarEvent.location;
		return toReturn;
	}

	this.orderLastEvent = function(events, callback){
		//insertion sort on the last event (pushed into the array)
		if(events.length >= 2){
			var toSortIndex = (events.length) -1;
			var index = (events.length) -2;
			var temp = {};
			console.log('toSortIndex: '+ toSortIndex);
			console.log(events.length);
			console.log(events[index].date);
			console.log(events[toSortIndex].date);
			while(index >= 0){
				if(events[index].date > events[toSortIndex].date){
					temp = events[index];
					events[index] = events[toSortIndex];
					events[toSortIndex] = temp;
					index -= 1;
					toSortIndex -= 1;
				}
				else{
					callback(events);
					return;
				}
			}
		}
		callback(events);
		return;
	}

	this.addToArray = function(object, array, callback){
		// so apperently this one causes race conditions (dafuq?)
		if(!angular.isArray(array)){
			if(angular.isObject(array)){
				var old = {};
				old = array;
				array =  new Array();
				array[0] = old;
			}
			else{
				console.log('is a null')
				array = new Array();
			}
		}
		array.push(object);
		callback(array);
	}

	this.saveEvents = function(events){
		console.log('saveEvents: '+events);
	  localStorage.setItem(localStorage.getItem("currentUser")+"/Events",JSON.stringify(events));
	}

	this.saveEvent = function(event){
		event = postprocessingEvent(calendarEvent);
		var calendarEvents = getEvents();
		console.log(calendarEvents);
		addToArray(calendarEvent, calendarEvents, function(newArray){
			 orderLastEvent(newArray, function(ordered){
				 saveEvents(ordered);
			 });
		});
	}

	this.addContact = function(nickname, email){
		contact.nickname = nickname;
		contact.email		 = email;
		var friendRequests = getFriendRequests();
		addToArray(contact,friendRequests, function(newArray){
			saveFriendRequests(newArray);
		});
	}

	this.getEvents = function(){
		return localStorage.getItem(localStorage.getItem("currentUser")+"/Events") ? JSON.parse(localStorage.getItem(localStorage.getItem("currentUser")+"/Events")) : [];
	}

	this.saveFriends = function(friends){
		localStorage.setItem(localStorage.getItem("currentUser")+"/Friends",JSON.stringify(friends));
	}

	this.getFriends = function(){
		return localStorage.getItem(localStorage.getItem("currentUser")+"/Friends") ? JSON.parse(localStorage.getItem(localStorage.getItem("currentUser")+"/Friends")) : [];
	}
});
