app.controller('waitingPageCtrl', ['$scope','$state','$http','$timeout','$firebaseArray','userMoney',

  function ($scope, $state,$http,$timeout,$firebaseArray,userMoney) {
  	
    var amount;

  	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    $scope.userID = user.uid;
	    firebase.database().ref("Users").child($scope.userID).update({available: false});
	    $timeout(function(){$scope.$apply();});
	  }
	});

	$scope.$on('$ionicView.afterEnter', function () {
		console.log('entered?');
        amount = userMoney.getRequest();
        $scope.simplifyList();
        firebase.database().ref("Users").child($scope.userID).update({available: false});
        $scope.cancelShow = false;
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

        function sendNotifies(withDist, num){
        	try{
        		firebase.database().ref('notify').child(withDist[num].info.uid).update({
  				distance: withDist[num].distance,
  				id: withDist[num].info.uid,
  				rating: withDist[num].info.rating,
  				displayName: withDist[num].info.displayName});
	  			$timeout(function(){
	  				console.log("after?");
	  				sendNotifies(withDist, num+1);
	  			},5000);
	  			
        	}catch(err){
        		console.log("went too high perhaps", err);
        	}
  			
        }

      $scope.simplifyList = function(){
	  	var ref = firebase.database().ref("Users");
	  	var userData = $firebaseArray(ref);
	  	var validUsers = [];
	  	var withDist = [];
	  	userData.$loaded().then(function(x){
	  		console.log("user data loaded");
	  		angular.forEach(userData,function(user){
	  			if(amount <= user.wallet && user.uid != $scope.userID && user.available == true){
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
	  		withDist.sort(function(a,b){
	  			return a['distance'] - b['distance'];
	  		});
	  		console.log("with dist and sort", withDist);
	  		sendNotifies(withDist, 0);
	  		$timeout(function(){
	  			$scope.cancelShow = true;
	  		},15000);
	  	});
      };
  	
  	

}	

]);