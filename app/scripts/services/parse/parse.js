'use strict';

angular.module('Parking.services')
.factory('Parse', ['$q', function($q){
  return{
    initialize : function(){
      Parse.initialize('OSp76NSTm4GS06HLer2NnaWK43EOytnPlD2WzMTU', '8haBHKSSW3cIb6W4IXsRa4EbEusqfOJvf9wH3TJO');
      return Parse;
    },
    currentUser : function(){
      return Parse.User.current();
    },
    fetchUser : function(){
      return Parse.User.current().fetch();
    },
    saveVehicle : function(vehicle_attr){
      var deferred = $q.defer();
      var user = Parse.User.current();
      var Vehicle = Parse.Object.extend("Vehicle");
      var vehicle = new Vehicle();
      var object = this;
      vehicle_attr.user = user;

      window.resolveLocalFileSystemURI(vehicle_attr.image, function(fileEntry){
        fileEntry.file( function(file) {
          var reader = new FileReader();
          reader.onloadend = function(evt) {
            
            object.uploadFile(evt.target.result).then(function(file){
              vehicle_attr.image = file;
              return vehicle.save(vehicle_attr);
            }).then(function(vehicle){
              deferred.resolve(vehicle);
            },function(error){
              alert('error');
            });
          };
          reader.readAsDataURL(file);
        }, function(){
          alert('failed');
        });
      });
      return deferred.promise;
    },
    deleteVehicle: function(vehicle){
      return vehicle.destroy();
    },
    getVehicle: function(vehicleId){
      var deferred = $q.defer();
      var user = Parse.User.current();
      var Vehicle = Parse.Object.extend('Vehicle');
      var query = new Parse.Query(Vehicle);
      query.equalTo('user',user);

      query.get(vehicleId).then(function(vehicle){
        deferred.resolve(vehicle);
      },function(error){
        deferred.reject(error);
      });
      return deferred.promise;
    },
    getVehicles: function(){
      var deferred = $q.defer();
      var user = Parse.User.current();
      var Vehicle = Parse.Object.extend('Vehicle');
      var query = new Parse.Query(Vehicle);
      query.equalTo('user',user);

      query.find().then(function(vehicles){
        console.log(vehicles);
        deferred.resolve(vehicles);
      },function(error){
        deferred.reject(error);
      });

      return deferred.promise;
    },
    saveCheckin: function(newCheckin){
      var deferred = $q.defer();
      var user = Parse.User.current();
      var Checkin = Parse.Object.extend('Checkin');
      var checkin = new Checkin();


      
      if(newCheckin.id){
        console.log(newCheckin.time);
        checkin.id = newCheckin.id;
        checkin.save({time:newCheckin.time}).then(function(checkin){
          deferred.resolve(checkin);
        },function(error){
          deferred.reject(error);
        });
      }
      else{
        newCheckin.user = user;
        newCheckin.plate = newCheckin.vehicle.plate;
        checkin.save(newCheckin).then(function(checkin){
          deferred.resolve(checkin);
        },function(error){
          deferred.reject(error);
        });
      }

      return deferred.promise;
    },
    getCheckins : function(){
      var deferred = $q.defer();
      var user = Parse.User.current();
      var Checkin = Parse.Object.extend('Checkin');
      var query = new Parse.Query(Checkin);
      query.equalTo('user',user);

      query.find().then(function(checkins){
        deferred.resolve(checkins);
      },function(error){
        deferred.reject(error);
      });

      return deferred.promise;
    },
    deleteCheckin: function(checkin){
      return checkin.destroy();
    },
    getCheckin: function(checkinId){
      var deferred = $q.defer();
      var Checkin = Parse.Object.extend('Checkin');
      var query = new Parse.Query(Checkin);

      query.get(checkinId).then(function(checkin){
        deferred.resolve(checkin);
      },function(error){
        deferred.reject(error);
      });

      return deferred.promise;
    },
    getGeopoint: function(latitude, longitude){
      return new Parse.GeoPoint([latitude, longitude]);
    },
    uploadFile: function(base64){
      var deferred = $q.defer();
      var file = new Parse.File("mycar.png", {base64:base64});

      file.save().then(function(file){
        deferred.resolve(file);
      },function(error){
        alert('error');
        deferred.reject(error);
      });

      return deferred.promise;
    },
    getSnaps: function(){
      var deferred = $q.defer();
      var user = Parse.User.current();
      var Snap = Parse.Object.extend('Snap');
      var query = new Parse.Query(Snap);
      query.equalTo('user', user);
      query.find().then(function(snaps){
        deferred.resolve(snaps);
      },function(error){
        deferred.reject(error);
      });
      return deferred.promise;
    },
    addSnap: function(snap_attributes){
      var deferred =  $q.defer();
      var user = Parse.User.current();
      var Snap = Parse.Object.extend("Snap");
      var snap = new Snap();
      snap_attributes.user = user;
      var plate = snap_attributes.plate;
      var object = this;
      var Checkin = Parse.Object.extend('Checkin');
      var query = new Parse.Query(Checkin);
      query.equalTo('plate',plate);
      query.descending('createdAt');
      query.limit(1);

      window.resolveLocalFileSystemURI(snap_attributes.image, function(fileEntry){
        fileEntry.file( function(file) {
          var reader = new FileReader();
          reader.onloadend = function(evt) {
            object.uploadFile(evt.target.result).then(function(file){
            snap_attributes.image = file;
            return query.find();
          }).then(function(checkins){

              if(checkins[0]){
                var checkin = checkins[0];
                var createdAt  = checkin.createdAt;
                var time = checkin.get('time');
                var date1 = new Date(createdAt).getTime() + (time*60*1000);
                var offset = new Date().getTimezoneOffset();
                var date2 = new Date().getTime();
                var remaining = date1-date2;
                snap_attributes.valid = remaining > 0 ? false : true;
              }else{
                snap_attributes.valid = true;
              }
              return snap.save(snap_attributes);
            }).then(function(snap){

              if(snap.valid){
                user = object.currentUser();
                user.set('credit',user.get('credit')+1);
                user.save().then(function(){
                  deferred.resolve(snap);
                },function(error){
                  deferred.reject(error);
                });
              }else{
                deferred.resolve(snap);
              }

            },function(error){
              alert(error.message);
              deferred.reject(error);
            });
          };
          reader.readAsDataURL(file);
        }, function(){
          alert('failed');
        });
      });

      return deferred.promise;
    },
    deleteSnap: function(snap){
      return snap.destroy();
    },
    login: function(username, password){
      var deferred = $q.defer();
      Parse.User.logIn(username, password).then(function(user){
        deferred.resolve(user);
      },function(error){
        deferred.reject(error);
      });
      return deferred.promise;
    },
    updateAccount: function(user){
      var deferred = $q.defer();
      user.save().then(function(user){
        deferred.resolve(user);
      },function(error){
        deferred.reject(error);
      });

      return deferred.promise;
    },
    signOut: function(){
      return Parse.User.logOut();
    },
    signUp: function(username, password){
      var user = new Parse.User();
      var deferred = $q.defer();
      user.set('username', username);
      user.set('password', password);
      user.signUp().then(function(user){
        deferred.resolve(user);
      },function(error){
        deferred.reject(error);
      });
      return deferred.promise;
    },
    updateToken: function(user){
      var deferred = $q.defer();
      user.save().then(function(user){
        console.log(user.get('stripeId'));
        console.log('token1'+user.get('token'));
        Parse.Cloud.run('updateStripe',{stripeId:user.get('stripeId'),token:user.get('token')}).
        then(function(){
          deferred.resolve(user);
        },function(error){
          deferred.reject(error);
        });

      // deferred.resolve(user);

      },function(error){
        deferred.reject(error);
      });

      return deferred.promise;
    }
  };
  
}]);