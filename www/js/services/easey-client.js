angular.module('starter').service('client',function($q, md5){
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
			});
			socket.on('refused', function(){
				return false;
			});
		});
	};

	this.isEmailUnique = function(email){
		//contact the server and check if email is OK or if it has been already used
		return $q(function(resolve, reject){
			socket = io.connect(SERVER_ADDRESS);
			socket.on('serverReady', function(){
				console.log('connected to the server, checking if email is ok');
				socket.emit('isEmailUnique', email);
				socket.on('emailUnique', function(){
					console.log('true');
					resolve();
					return true;
				});
				socket.on('emailIsPresent', function(){
					console.log('false');
					reject();
				});
			});
		});
	}


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
					return true;
				});
				console.log("login failed");
				return false;
		});
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
