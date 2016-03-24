angular.module('starter').service('client',function(){
	// CONSTANTS
	const PORT = 34237; //easey leet
	const SERVER_ADDRESS ="easey.noip.me:"+PORT;


	this.signup = function(data){
		socket = io.connect(SERVER_ADDRESS);
		socket.on('connect',function(){
			console.log("connected with the server, signing up");
			var toSend = {};
				toSend.email = data.username;
				toSend.username = data.username;
				toSend.password = md5.createHash(data.password);
			socket.emit('signup',toSend);
			socket.on('accepted', function(){
				return true;
				})
				return false;
		})
	};


	this.login = function(username, password){
		socket.connect(SERVER_ADDRESS);
		socket.on('connect',function(){
			console.log("connected to the server, loggin in");
			var toSend = {};
				toSend.username = username;
				toSend.password = md5.createHash(password);
				socket.emit('login', toSend);
				socket.on('accepted',function(){
						console.log("sign in accepted");
				});
				console.log("login failed");
				return false;
		});
	};

	this.saveEvent = function(event){
		socket.connect(SERVER_ADDRESS);
		socket.on('connect',function(){
			console.log("connected, attemping to save an event on the server");
			socket.emit('saveEvent',event);
			socket.on('accepted', function(){
				console.log("Event saved");
				return true;
			})
			console.log("Event could not be saved");
			return false;
		})
	};

	this.getEvents = function(username, password){
		socket.connect(SERVER_ADDRESS);
		socket.on('serverReady',function(){
			console.log("connected, attemping to get events from the server");
			var toSend = {};
			toSend.username = username;
			toSend.password = md5.createHash(password);
			socket.emit('getEvents',toSend);
			socket.on('accepted', function(serverEvents){
				console.log("Server returns events for user ")
				return serverEvents;
			});
			console.log("Server does not respond")
			return null;
		});
	}

	this.saveEvent = function(calendarEvent){
		var socket = io.connect(SERVER_ADDRESS);
		socket.on('serverReady',function(){
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
			return;
		});
	}

	this.getFriendEvents = function(username, friendUsername){
		var socket = io.connect(SERVER_ADDRESS);
		socket.on('serverReady', function(){
			var toSend = {};
			toSend.username = username;
			toSend.friendUsername = friendUsername;
			socket.emit('getFriendEvents', toSend);
			socket.on('friendEvents', function(events){
				return events;
			});
			socket.on('error', function(){
				console.log('error receiveing friend events');
				return [];
			});
		});
	}

});
