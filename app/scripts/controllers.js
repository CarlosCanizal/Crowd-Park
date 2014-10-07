'use strict';
angular.module('Parking.controllers', [])

.controller('AppCtrl', function($scope, $state, $ionicModal, Parse) {

  if(!Parse.currentUser()){
    $state.go('anon');
    return;
  }

  $scope.signOut = function(){
    Parse.signOut();
    $state.go('anon');
  };

})
.controller('VehiclesCtrl', function($scope,$ionicModal, $ionicLoading, Parse, VehicleParser) {

  $ionicLoading.show({
      template: 'Loading...'
  });

  $scope.vehicle = {};
  $scope.vehicles = [];

  $ionicModal.fromTemplateUrl('templates/addVehicle.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalVehicle = modal;
  });

  $scope.addImage = function(){
    navigator.camera.getPicture(function(imageURI){
      $scope.vehicle.image = imageURI;
      $scope.$apply();
    }, function(message){
      console.log('Failed because: ' + message);
    },  { quality: 50,
          destinationType: Camera.DestinationType.FILE_URI,
          allowEdit: true
        });
  };

  $scope.addVehicle = function(form){
    $scope.error = false;
    if(form.$valid){
      $ionicLoading.show({
        template: 'Loading...'
      });

      Parse.saveVehicle($scope.vehicle).then(function(vehicle){
          $scope.vehicles.push(vehicle);
          $ionicLoading.hide();
          $scope.closeVehicle(form);
        },function(error){
          $ionicLoading.hide();
          alert(error.message);
      });
    };
  }

  $scope.openVehicle = function() {
    $scope.modalVehicle.show();
  };

  $scope.closeVehicle = function(form) {
    $scope.vehicle = {};
    form.$setPristine();
    $scope.modalVehicle.hide();
  };
  

  $scope.deleteVehicle = function(vehicle){
    
    Parse.deleteVehicle(vehicle).then(function(){
      var index = $scope.vehicles.indexOf(vehicle);
      $scope.vehicles.splice(index,1);
      $scope.$apply();
    },function(error){
      console.log(error.message);
    });
  };

  Parse.getVehicles().then(function(vehicles){
    $ionicLoading.hide();
    $scope.vehicles = vehicles;
  },function(error){
    console.log(error.message);
  });
})
.controller('VehicleCtrl', function($scope, $stateParams,$ionicLoading, Parse, VehicleParser) {

  var id = $stateParams.vehicleId;
  Parse.getVehicle(id).then(function(vehicle){
    $scope.vehicle = vehicle;
  },function(error){
    console.log(error.message);
  });

})
.controller('CheckinCtrl', function($scope, $state, $interval, $ionicLoading, Parse, CheckinParser) {

  $ionicLoading.show({
    template: 'Loading...'
  });

  $scope.hideBackButton = false;
  $scope.error = null;
  
  Parse.getCheckins().then(function(checkins){
    $ionicLoading.hide();
    $scope.checkins = checkins;
  },function(error){
    console.log(error);
  });

  $scope.deleteCheckin = function(checkin){

    Parse.deleteCheckin(checkin).then(function(){
      var index = $scope.checkins.indexOf(checkin);
      $scope.checkins.splice(index,1);
      $scope.$apply();
    },function(error){
      console.log(error.message);
    });
  };

  $scope.$on('$stateChangeSuccess', function (ev, from, fromParams, to, toParams) {
    $scope.hideBackButton=true;
  });

})
.controller('AccountCtrl',function($scope, $state, $ionicLoading, Parse, UserParser){
  
  $scope.user = Parse.currentUser();
  console.log($scope.user.get('firstname'));

  $scope.updateAccount = function(form){
    $scope.error = false;
    if(form.$valid){
      $ionicLoading.show({
        template: 'Loading...'
      });
      Parse.updateAccount($scope.user).then(function(user){
        Parse.fetchUser();
        $ionicLoading.hide();
        console.log(user);
      },function(error){
        $ionicLoading.hide();
        console.log(error);
        $scope.error = error;
      });
    }
  };

})
.controller('ParkingCtrl', function($scope, $state, $stateParams, $ionicModal, $ionicLoading, Parse, VehicleParser,CheckinParser) {

  var checkinId = $stateParams.checkinId;

  $scope.checkin = {};
  $scope.prevTime = 0;
  $scope.rate = 3.00;
  $scope.checkin.time = 60;
  $scope.checkin.payment = (($scope.checkin.time/60)*$scope.rate).toFixed(2);
  $scope.vehicle = {};
  $scope.vehicles = [];
  $scope.isNew = true;
  $scope.error = null;

  if(checkinId !== 'new'){
    $scope.isNew = false;
    Parse.getCheckin(checkinId).then(function(checkin){
        // $scope.checkin.vehicle = checkin.vehicle;
        $scope.checkin = checkin;
        $scope.prevTime = $scope.checkin.time;
        // $scope.checkin.time = 15;
        $scope.vehicles.push(checkin.vehicle);
      },function(error){
        console.log(error);
    });

  }else{

    navigator.geolocation.getCurrentPosition(function(position){
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      $scope.checkin.geopoint = Parse.getGeopoint(latitude, longitude);
     }, function(error){
      console.log(error.message);
     });

    Parse.getVehicles().then(function(vehicles){
      $scope.vehicles = vehicles;
      $scope.checkin.vehicle= vehicles[0];
    },function(error){
      console.log(error.message);
    });

  }

  $scope.plus = function(){
    $scope.checkin.time += 15;
    $scope.checkin.payment = (($scope.checkin.time/60)*$scope.rate).toFixed(2);
  };

  $scope.minus = function(){
    var time = $scope.checkin.time - 15;
    $scope.checkin.time = time > 0 ? time : $scope.checkin.time;
    $scope.checkin.payment = (($scope.checkin.time/60)*$scope.rate).toFixed(2);
  };

  $scope.selectVehicle = function(vehicle,$event){
    $scope.checkin.vehicle = vehicle;
    angular.element(document.querySelectorAll('.selected')).removeClass('selected');
    angular.element($event.currentTarget).addClass('selected');
  };

  $ionicModal.fromTemplateUrl('templates/addVehicle.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalVehicle = modal;
  });

  $scope.newCheckin = function(){
    $scope.error = false;
    $ionicLoading.show({
      template: 'Loading...'
    });
    console.log($scope.checkin);
    if ($scope.isNew){
      $scope.checkin.vehicle = $scope.checkin.vehicle.toJSON();
    }
    else{
      $scope.checkin.time = $scope.checkin.time+$scope.prevTime;
    }
    Parse.saveCheckin($scope.checkin).then(function(checkin){
      console.log(checkin);
      $ionicLoading.hide();
      $state.go('app.checkin');
    },function(error){
      $ionicLoading.hide();
      $scope.error = error;
      console.log(error);
    });
  };

  $scope.addVehicle = function(isValid){
    if(isValid){
      Parse.saveVehicle($scope.vehicle).then(function(vehicle){
        $scope.vehicles.push(vehicle);
        $scope.closeVehicle();
      },function(error){
        console.log(error);
        $scope.error = error;
      });
    }
  };

  $scope.openVehicle = function() {
    $scope.modalVehicle.show();
  };

  $scope.closeVehicle = function() {
    $scope.modalVehicle.hide();
  };

})
.controller('SnapsCtrl', function($scope, $state, $stateParams, $ionicModal, $ionicLoading, Parse, SnapParser) {

  $ionicLoading.show({
      template: 'Loading...'
  });

  $scope.snap = {};
  $scope.snaps = [];
  $scope.error = false;

  navigator.geolocation.getCurrentPosition(function(position){
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    $scope.snap.geopoint = Parse.getGeopoint(latitude, longitude);
   }, function(error){
    alert(error.message);
   });

  Parse.getSnaps().then(function(snaps){
    $ionicLoading.hide();
    $scope.snaps = snaps;
  },function(error){
    console.log(error.message);
  });

  $ionicModal.fromTemplateUrl('templates/addSnap.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalSnap = modal;
  });

  $scope.openSnap = function(){
    $scope.modalSnap.show();
  };

  $scope.closeSnap = function(form){
    $scope.snap= {};
    form.$setPristine();
    $scope.modalSnap.hide();
  };


  $scope.addSnap = function(form){
    $scope.error = false;
    if(form.$valid){
      $ionicLoading.show({
          template: 'Loading...'
      });
      console.log($scope.snap);
      Parse.addSnap($scope.snap).then(function(snap){
        Parse.fetchUser();
        $ionicLoading.hide();
        $scope.snaps.push(snap);
        $scope.closeSnap(form);
      },function(error){
        $ionicLoading.hide();
        alert(error.message);
        $scope.error =  error;
      });
    }
  };

  $scope.deleteSnap = function(snap){
    Parse.deleteSnap(snap).then(function(){
      var index = $scope.snaps.indexOf(snap);
      $scope.snaps.splice(index,1);
      $scope.$apply();
    },function(error){
      alert(error);
    });
  };

  $scope.addImage = function(){
    navigator.camera.getPicture(function(imageURI){
      $scope.snap.image = imageURI;
      $scope.$apply();
    }, function(message){
      console.log('Failed because: ' + message);
    },  { quality: 50,
          destinationType: Camera.DestinationType.FILE_URI,
          allowEdit: true
        });
  };


})
.controller('SnapCtrl', function($scope, $state, $stateParams, $ionicModal, Parse, VehicleParser,CheckinParser) {

})
.controller('AnonCtrl', function($scope, $state, $stateParams, $ionicModal, Parse, VehicleParser,CheckinParser,UserParser) {

  if(Parse.currentUser()){
    $state.go('app.checkin');
    return;
  }

   // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalRegister = modal;
  });

  $scope.user = {};
  $scope.error = null;

  // Perform the login action when the user submits the login form
  $scope.doLogin = function(isValid) {
    if(isValid){
      var username = $scope.user.username;
      var password = $scope.user.password;
      Parse.login(username, password).then(function(){
        console.log('login');
        $state.go('app.checkin');
        $scope.closeLogin();
      },function(error){
        console.log(error);
        $scope.error = error;
      });
    }
  };

  $scope.doRegister = function(isValid){

    if(isValid){
      Parse.signUp($scope.user.username,$scope.user.password).then(function(user){
        console.log(user);
        $state.go('app.checkin');
        $scope.closeRegister();
      },function(error){
        console.log(error.message);
        $scope.error = error;
      });
    }
  };

  // Open the login modal
  $scope.openRegister = function() {
    $scope.modalRegister.show();
  };

  // Triggered in the login modal to close it
  $scope.closeRegister = function() {
    $scope.modalRegister.hide();
  },

  // Open the login modal
  $scope.openLogin = function() {
    $scope.modal.show();
  };

  // Triggered in the login modal to close it©
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

})
.controller('BillingCtrl', function($scope, $state, $stateParams, $ionicModal,Parse,Stripe,UserParser) {
  $scope.credit = Parse.currentUser().credit.toFixed(2);
  $scope.card = {};
  $scope.updateCard = function(){
    Stripe.updateCard($scope.card).then(function(token){
      console.log(token);
    },function(error){
      $scope.error = error;
      console.log(error.message);
    });
  };

});
