// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js


angular.module('starter', ['ionic','angular-md5', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

// .config(function($ionicConfigProvider){
// 	$ionicConfigProvider.platform.android.tabs.position('bottom');
// })

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider){

 $ionicConfigProvider.platform.android.tabs.position('bottom');

  $stateProvider
	.state('login',{
			url: '/login',
			templateUrl: 'templates/login.html',
			controller: 'LoginCtrl'
	})
	.state('signup',{
			url: '/signup',
			templateUrl: 'templates/signup.html',
			controller: 'signupCtrl'
	})
	.state('overview',{
		url: '/overview',
		templateUrl: 'templates/overview.html',
		controller: 'overviewCtrl'
	})
	.state('dayView',{
		url:'/dayView',
		templateUrl: 'templates/dayView.html',
		controller: 'dayViewCtrl'
	})
	.state('weekView',{
		url:'/weekView',
		templateUrl:'templates/weekView.html',
		controller: 'weekViewCtrl'
	});
  // if none of the above states are matched, use this as the fallback
   $urlRouterProvider.otherwise('/login');
});
