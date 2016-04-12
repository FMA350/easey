angular.module('starter').service('storage',function(){
	const FRIENDS = '/Friends';
	const FRIENDS_REQUESTS = "/Friends/Requests";
	const FRIENDS_PENDING = "/Friends/Pending";
	const EVENTS = '/Events';
	const EVENTS_PENDING = '/Events/Pending';

	saveFriendRequests = function(requests){
		localStorage.setItem(localStorage.getItem("currentUser")+FRIENDS_REQUESTS ,JSON.stringify(requests));
	}

 	this.getFriendRequests = function(){
		return localStorage.getItem(localStorage.getItem("currentUser")+ FRIENDS_REQUESTS) ? JSON.parse(localStorage.getItem(localStorage.getItem("currentUser")+ FRIENDS_REQUESTS)) : [];
	}

	this.postprocessingEvent = function(calendarEvent){
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

	orderLastEvent = function(events, callback){
		//insertion sort on the last event (pushed into the array)
		if(events.length >= 2){
			var toSortIndex = (events.length) -1;
			var index = (events.length) -2;
			var temp = {};
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

	saveEvents = function(events){
		console.log('saveEvents: '+events);
	  localStorage.setItem(localStorage.getItem("currentUser")+"/Events",JSON.stringify(events));
	}

	this.getEvents = function(){
		return localStorage.getItem(localStorage.getItem("currentUser")+"/Events") ? JSON.parse(localStorage.getItem(localStorage.getItem("currentUser")+"/Events")) : [];
	}

	this.saveFriends = function(friends){
		localStorage.setItem(localStorage.getItem("currentUser")+FRIENDS, JSON.stringify(friends));
	}

	this.getFriends = function(){
		 return localStorage.getItem(localStorage.getItem("currentUser")+FRIENDS) ? JSON.parse(localStorage.getItem(localStorage.getItem("currentUser")+FRIENDS)) : [];
		//  var temp = localStorage.getItem(localStorage.getItem("currentUser")+ FRIENDS);
		//  if(temp.isObject) return JSON.parse(temp);
		//  else return [];
		//  		//return [];
	}

	this.saveEvent = function(event){
		//event = this.postprocessingEvent(event);
		console.log(event);
		var events = this.getEvents();
		this.addToArray(event, events, function(newArray){
			console.log(newArray);
			 orderLastEvent(newArray, function(ordered){
				 saveEvents(ordered);
			 });
		});
	}

	this.saveFriend = function(nickname, email){
		var contact = {};
		contact.nickname = nickname;
		contact.email		 = email;
		var friends = this.getFriends();
		console.log(friends);
		this.addToArray(contact, friends, function(newArray){
			saveFriendRequests(newArray);
		});
	}

	this.removeEvent = function(index){
		var events = this.getEvents();
		events.splice(index, 1);
		saveEvents(events);
	}
});
