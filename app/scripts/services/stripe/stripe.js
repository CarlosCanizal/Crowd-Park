angular.module('Parking.services')
.factory('Stripe', ['$q','Parse', function($q, Parse){
  return{
    updateCard : function(card){
      var deferred = $q.defer();
      Stripe.setPublishableKey('pk_test_VAQAoKPqcOhzaa33ym3Kaga8');
      Stripe.card.createToken(card, function(status, response){
        if(response.error){
          deferred.reject(response.error);
        }else{
          var token = response.id;
          var user = Parse.currentUser();
          user.set('token',token);
          Parse.updateToken(user).then(function(user){
            deferred.resolve(user);
          },function(error){
            deferred.reject(error);
          });
        }
      });
      return deferred.promise;
    },
  };
}]);