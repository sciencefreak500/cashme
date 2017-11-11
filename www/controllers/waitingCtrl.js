app.controller('waitingPageCtrl', ['$scope','$state','$http','$timeout','$firebaseArray','userMoney',

  function ($scope, $state,$http,$timeout,$firebaseArray,userMoney) {
  	
    var amount;

  	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    $scope.userID = user.uid;
	    $timeout(function(){$scope.$apply();});
	  }
	});

	$scope.$on('$ionicView.afterEnter', function () {
		console.log('entered?');
        amount = userMoney.getRequest();
        $scope.simplifyList();
      });

	function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(lat2 - lat1); // deg2rad below
            var dLon = deg2rad(lon2 - lon1);
            var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c; // Distance in km
            return d;
        }

        function deg2rad(deg) {
            return deg * (Math.PI / 180);
        }


      $scope.simplifyList = function(){
	  	var ref = firebase.database().ref("Users");
	  	var userData = $firebaseArray(ref);
	  	var validUsers = [];
	  	var withDist = [];
	  	userData.$loaded().then(function(x){
	  		console.log("user data loaded");
	  		angular.forEach(userData,function(user){
	  			if(amount <= user.wallet && user.uid != $scope.userID){
	  				validUsers.push(user);
	  			}
	  			if(user.uid == $scope.userID){
	  				$scope.mylong = user.longitude;
	  				$scope.mylat = user.latitude;
	  			}
	  		});
	  		angular.forEach(validUsers, function(valid){
	  			var dist = getDistanceFromLatLonInKm($scope.mylat, $scope.mylong, valid.latitude, valid.longitude);
	  			withDist.push({info:valid,distance:dist});
	  		});
	  		console.log("with dist", withDist);

	  	});
      }
  	
  	

}	

]);