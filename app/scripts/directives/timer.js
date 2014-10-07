angular.module('Parking.directives')
.directive('timer', function($interval) {
  return {
    restrict: 'A',
    link: function(scope, elem, attr) {
      var time  = scope.checkin.time;
      var createdAt = scope.checkin.createdAt;
      var date1 = new Date(createdAt).getTime() + (time*60*1000);
      // var offset = new Date().getTimezoneOffset();
      // var date2 = new Date().getTime()+(offset*60*1000);

      var interval = $interval(function() {
        var date2 = new Date().getTime();
        var remaining = date1-date2;

        if(remaining > 0){
          var seconds = Math.floor(remaining/1000);
          var hours  = Math.floor(seconds/60/60);
          var minutes  = Math.floor((seconds/60)%60);
          seconds= Math.floor((seconds%60%60));
          minutes = minutes < 10 ? "0"+minutes : minutes;
          seconds = seconds < 10 ? "0"+seconds : seconds;
          var countdown =  hours+":"+minutes+":"+seconds;
          scope.checkin.countdown = countdown;
          scope.checkin.inactive = false;
        }
        else{
          scope.checkin.countdown = 'Timeout';
          scope.checkin.inactive = true;
          $interval.cancel(interval);
        }
      },1000);
    }
  };
});