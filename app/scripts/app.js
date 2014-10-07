'use strict';
// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('Parking', [
  'ionic',
  'config',
  'Parking.controllers',
  'Parking.services',
  'Parking.directives'
])

.run(function($ionicPlatform, Parse) {

  //Initialize Parse
  Parse.initialize();
  

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)


    setTimeout(function() {
      navigator.splashscreen.hide();
    }, 100);


    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('anon', {
      url: '/anon',
      templateUrl: 'templates/anon.html',
      controller: 'AnonCtrl'
    })
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })
    .state('app.account', {
      url: '/account',
      views: {
        'menuContent' :{
          templateUrl: 'templates/account.html',
          controller: 'AccountCtrl'
        }
      }
    })

    .state('app.billing', {
      url: '/billing',
      views: {
        'menuContent' :{
          templateUrl: 'templates/billing.html',
          controller: 'BillingCtrl'
        }
      }
    })
    .state('app.parking', {
      url: '/parking/:checkinId',
      views: {
        'menuContent' :{
          templateUrl: 'templates/parking.html',
          controller: 'ParkingCtrl'
        }
      }
    })
    .state('app.checkin', {
      url: '/checkin',
      views: {
        'menuContent' :{
          templateUrl: 'templates/checkin.html',
          controller: 'CheckinCtrl'
        }
      }
    })
    .state('app.vehicles', {
      url: '/vehicles',
      views: {
        'menuContent' :{
          templateUrl: 'templates/vehicles.html',
          controller: 'VehiclesCtrl'
        }
      }
    })
    .state('app.vehicle', {
      url: '/vehicles/:vehicleId',
      views: {
        'menuContent' :{
          templateUrl: 'templates/vehicle.html',
          controller: 'VehicleCtrl'
        }
      }

    })
    .state('app.snaps', {
      url: '/snaps',
      views: {
        'menuContent' :{
          templateUrl: 'templates/snaps.html',
          controller: 'SnapsCtrl'
        }
      }
    })
    .state('app.snap', {
      url: '/snaps/:snapId',
      views: {
        'menuContent' :{
          templateUrl: 'templates/snap.html',
          controller: 'SnapCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/anon');
});

angular.module('Parking.services',[]);
angular.module('Parking.directives',[]);

