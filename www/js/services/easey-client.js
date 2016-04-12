angular.module('starter').service('client',function($q, md5){
	// CONSTANTS

	const PORT = 34237; //easey leet
	const SERVER_ADDRESS ="easey.noip.me:"+PORT;

	this.signup = function(data, callback){
		var socket = io.connect(SERVER_ADDRESS);
		socket.on('serverReady',function(){
			console.log("connected with the server, signing up");
			var toSend = {};
				toSend.email = data.username;
				toSend.username = data.username;
				toSend.password = md5.createHash(data.password);
			socket.emit('signup',toSend);
			socket.on('accepted', function(){
				callback(true);
			});
			socket.on('refused', function(){
				callback(false);
			});
		});
	};

	this.isEmailUnique = function(email){
		//contact the server and check if email is OK or if it has been already used
		return $q(function(resolve, reject){
			var socket = io.connect(SERVER_ADDRESS);
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
		//asynch
		return $q(function(resolve, reject){
			var socket = io.connect(SERVER_ADDRESS);
			socket.on('serverReady',function(){
				console.log("connected to the server, trying to log in");
				var toSend = {};
					toSend.username = username;
					toSend.password = md5.createHash(password);
					socket.emit('login', toSend);
					socket.on('success',function(){
						console.log("sign in accepted");
						socket.close();
						resolve();
					});
					socket.on('refused', function(reason){
						console.log("login failed");
						console.log(reason);
						socket.close();
						reject(reason);
					});
		});
		});
	};

	this.getEvents = function(username, password, callback){
		var socket = io.connect(SERVER_ADDRESS);
		socket.on('serverReady',function(){
			console.log("connected, attemping to get events from the server");
			var toSend = {};
			toSend.username = username;
			toSend.password = md5.createHash(password);
			socket.emit('getEvents',toSend);
			socket.on('accepted', function(serverEvents){
				console.log("Server returns events for user ")
				callback(serverEvents);
			});
			console.log("Server does not respond")
			callback([]);
		});
	}

	this.getPendingEvents = function(username, callback){
		var socket = io.connect(SERVER_ADDRESS);
		socket.emit('getPendingEvents', username);
		socket.on("pendingEvents", function(newEvents){
			console.log(newEvents);
			callback(newEvents);
			socket.close();
			return;
		});
		//NOT IMPLEMENTED YET ON THE SERVER
		// socket.on('error', function(reason){
		// 	console.log(reason);
		// 	callback([]);
		// 	socket.close();
		// 	return;
		// });
	}

	this.saveEvent = function(calendarEvent){
		var socket = io.connect(SERVER_ADDRESS);
		socket.on('serverReady',function(){
			console.log("connetion with the server, saving calendarEvent...");
			var toSend = {};
			toSend.username = localStorage.getItem("currentUser");
			toSend.name = calendarEvent.name;
			toSend.date = calendarEvent.date;
			toSend.share = calendarEvent.share;
			if(calendarEvent.share === 'invite'){
					toSend.friends = calendarEvent.friends;
				}
			else{toSend.friends = [];}
			socket.emit('saveEvent',toSend);
			socket.on('success', function(){
				console.log('event saved successfully on the server')
				socket.close();
				return;
			});
			socket.on('error', function(reason){
				console.log('An error occured, server answered with: '+ reason);
				socket.close();
				return;
			})
		});
	}

	this.getFriendEvents = function(username, friendUsername, callback){
		var socket = io.connect(SERVER_ADDRESS);
		socket.on('serverReady', function(){
			var toSend = {};
			toSend.username = username;
			toSend.friendUsername = friendUsername;
			socket.emit('getFriendEvents', toSend);
			socket.on('friendEvents', function(events){
				callback(events);
				socket.close();
				return;
			});
			socket.on('error', function(){
				console.log('error receiveing friend events');
				callback([]);
				socket.close();
				return;
			});
		});
	}

	this.getFriendRequests = function(username, callback){
		var socket = io.connect(SERVER_ADDRESS);
		socket.on('serverReady', function(){
			socket.emit('getFriendRequests', username);
			socket.on('friendRequests', function(friendRequests){
				//returns an array.
				console.log(friendRequests);
				callback(friendRequests);
				socket.close();
				return;
			});
			socket.on('error', function(reason){
				console.log(reason);
				callback([]);
				socket.close();
				return;
			});
		});
	}

	this.sendFriendRequest = function(requestFrom, requestTo, message, callback){

		var toSend = {};
		toSend.from = requestFrom; //The user
		toSend.to = requestTo;		// The friend to be
		toSend.message = message;
		console.log(toSend);

		var socket = io.connect(SERVER_ADDRESS);
		socket.on('serverReady', function(){
			socket.emit('sendFriendRequest', toSend)
			socket.on('success', function(){
				callback('Friend request sent');
				return;
			});
			// socket.on('error', function(reason){
			// 	//does not emit this...
			// 	console.log(reason);
			// 	callback(reason);
			// 	return;
			// });
		});
	}

	this.answerFriendRequest = function(requestFrom, requestTo, answer, callback){
		toSend = {};
		toSend.requestFrom = requestFrom;
		toSend.requestTo 	 = requestTo;

		var socket = io.connect(SERVER_ADDRESS);
		socket.on('serverReady', function(){
			if(answer){
				socket.emit('acceptFriendRequest', toSend);
				socket.on('success', function(){
					socket.close;
					callback('sent');
					return;
				});
				socket.on('error', function(reason){
					console.log(reason);
					socket.close;
					callback(reason);
					return;
					});
			}
			else{
				socket.emit('refuseFriendRequest', toSend);
				socket.on('success', function(){
					socket.close;
					callback('frienship refused.');
					return;
				});
				socket.on('error', function(reason){
					console.log(reason);
					socket.close;
					callback(reason);
					return;
					});
			}
		});
	}

	this.deleteFriendship = function(user, friend, callback){
		toSend = [];
		toSend[0] = user;
		toSend[1] = friend
		socket = io.connect(SERVER_ADDRESS);
		socket.on('serverReady', function(){
			socket.emit('deleteFriendship', toSend)
			socket.on('success', function(){
				callback('Friendship deleted');
				return;
			});
			socket.on('error', function(reason){
				console.log(reason);
				callback(reason);
				return;
				});
		});
	}

	this.getFriends = function(username, callback){
		console.log('getFriends')
		var socket = io.connect(SERVER_ADDRESS);
		socket.on('serverReady', function(){
			socket.emit('getFriends', username);
			socket.on('friendsList', function(friendList){
				//returns an array.
				console.log(friendList);
				callback(friendList);
				socket.close();
				return;
			});
			socket.on('error', function(reason){
				console.log(reason);
				callback([]);
				socket.close();
				return;
			});
		});
	}

	this.deletePendingEvent = function(username, event){
		//TODO: Add the callback functionality
		var toSend = {}
		toSend.username = username;
		toSend.event = event;
		var socket = io.connect(SERVER_ADDRESS);
		socket.on('serverReady', function(){
			socket.emit('deletePendingEvent', toSend);
		});
	}

//TODO: change password from the app
//TODO: accept/refuse invite functionalities





















});
