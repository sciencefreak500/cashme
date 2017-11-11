app.controller('waitingPageCtrl', ['$scope','$state','$http','$timeout',

  function ($scope, $state,$http,$timeout) {
  	
    

  	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    $scope.userID = user.uid;
	    $timeout(function(){$scope.$apply();});
	  }
	});

  	

}	

]);