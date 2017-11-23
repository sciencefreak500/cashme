app.controller('confirmationCtrl', ['$scope','$state','$http','$timeout','$firebaseArray','otherUser',

  function ($scope, $state,$http,$timeout,$firebaseArray,otherUser) {
  	
    var amount;

  	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    $scope.userID = user.uid;
	    $timeout(function(){$scope.$apply();});
	  }
	});

	$scope.$on('$ionicView.afterEnter', function () {
		console.log('entered?');
		$scope.other = otherUser.getData();

      });

	
	$scope.cancelRequest = function(){
		console.log("cancel request");
		firebase.database().ref("Users").child($scope.userID).update({available: true});
		$atate.go('wallet');
	};
  	
	$scope.submitToEscrow = function(){
		console.log("submitting to escrow");
	};
}	

]);