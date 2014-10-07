angular.module('Parking.services').
factory('VehicleParser', function() {

  var Vehicle = Parse.Object.extend("Vehicle", {
      // Instance methods
    }, {
      // Class methods
    }
  );

  //name property
  Vehicle.prototype.__defineGetter__("name", function() {
    return this.get("name");
  });
  Vehicle.prototype.__defineSetter__("name", function(aValue) {
    return this.set("name", aValue);
  });

  // plate property
  Vehicle.prototype.__defineGetter__("plate", function() {
    return this.get("plate");
  });
  Vehicle.prototype.__defineSetter__("plate", function(aValue) {
    return this.set("plate", aValue);
  });

  // image property
  Vehicle.prototype.__defineGetter__("image", function() {
    return this.get("image");
  });
  Vehicle.prototype.__defineSetter__("image", function(aValue) {
    return this.set("image", aValue);
  });

  // user property
  Vehicle.prototype.__defineGetter__("user", function() {
    return this.get("user");
  });
  Vehicle.prototype.__defineSetter__("user", function(aValue) {
    return this.set("user", aValue);
  });

  return Vehicle;

}).
factory('CheckinParser', function() {

  var Checkin = Parse.Object.extend("Checkin", {
      // Instance methods
    }, {
      // Class methods
    }
  );

  //plate property
  Checkin.prototype.__defineGetter__("vehicle", function() {
    return this.get("vehicle");
  });
  Checkin.prototype.__defineSetter__("vehicle", function(aValue) {
    return this.set("vehicle", aValue);
  });

  // time property
  Checkin.prototype.__defineGetter__("time", function() {
    return this.get("time");
  });
  Checkin.prototype.__defineSetter__("time", function(aValue) {
    return this.set("time", aValue);
  });

  // user property
  Checkin.prototype.__defineGetter__("user", function() {
    return this.get("user");
  });
  Checkin.prototype.__defineSetter__("user", function(aValue) {
    return this.set("user", aValue);
  });

  //payment property
  Checkin.prototype.__defineGetter__("payment", function() {
    return this.get("payment");
  });
  Checkin.prototype.__defineSetter__("payment", function(aValue) {
    return this.set("payment", aValue);
  });

  return Checkin;

}).
factory('SnapParser', function() {

  var Snap = Parse.Object.extend("Snap", {
      // Instance methods
    }, {
      // Class methods
    }
  );

  //plate property
  Snap.prototype.__defineGetter__("plate", function() {
    return this.get("plate");
  });
  Snap.prototype.__defineSetter__("plate", function(aValue) {
    return this.set("plate", aValue);
  });

  // image property
  Snap.prototype.__defineGetter__("image", function() {
    return this.get("image");
  });
  Snap.prototype.__defineSetter__("image", function(aValue) {
    return this.set("image", aValue);
  });

  // user property
  Snap.prototype.__defineGetter__("user", function() {
    return this.get("user");
  });
  Snap.prototype.__defineSetter__("user", function(aValue) {
    return this.set("user", aValue);
  });

  // valid property
  Snap.prototype.__defineGetter__("valid", function() {
    return this.get("valid");
  });
  Snap.prototype.__defineSetter__("valid", function(aValue) {
    return this.set("valid", aValue);
  });

  return Snap;

}).
factory('UserParser', function() {

  var User = Parse.User;

  //name property
  User.prototype.__defineGetter__("firstname", function() {
    return this.get("firstname");
  });
  User.prototype.__defineSetter__("firstname", function(aValue) {
    return this.set("firstname", aValue);
  });

  //lastname property
  User.prototype.__defineGetter__("lastname", function() {
    return this.get("lastname");
  });
  User.prototype.__defineSetter__("lastname", function(aValue) {
    return this.set("lastname", aValue);
  });

  //email property
  User.prototype.__defineGetter__("email", function() {
    return this.get("email");
  });
  User.prototype.__defineSetter__("email", function(aValue) {
    return this.set("email", aValue);
  });

  //username property
  User.prototype.__defineGetter__("username", function() {
    return this.get("username");
  });
  User.prototype.__defineSetter__("username", function(aValue) {
    return this.set("username", aValue);
  });

  //credit property
  User.prototype.__defineGetter__("credit", function() {
    return this.get("credit");
  });
  User.prototype.__defineSetter__("credit", function(aValue) {
    return this.set("credit", aValue);
  });
  
  //stripeId property
  User.prototype.__defineGetter__("stripeId", function() {
    return this.get("stripeId");
  });
  User.prototype.__defineSetter__("stripeId", function(aValue) {
    return this.set("stripeId", aValue);
  });

  //token property
  User.prototype.__defineGetter__("token", function() {
    return this.get("token");
  });
  User.prototype.__defineSetter__("token", function(aValue) {
    return this.set("token", aValue);
  });

  return User;

});

