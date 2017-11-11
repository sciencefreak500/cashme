app.controller('walletPageCtrl', ['$scope','$state','$http','userMoney','$timeout',

  function ($scope, $state,$http,userMoney,$timeout) {
  	console.log("wallet page");
  	$scope.money = {wallet: 1, request: 1};
    

  	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    $scope.userID = user.uid;
	    $scope.user = {displayName: user.displayName, photoURL: user.photoURL};
	    $timeout(function(){$scope.$apply();});
	  }
	});

  	$scope.requestCash = function(){
  		console.log("requesting cash");
  		userMoney.setRequest($scope.money.request);
      $state.go('waiting');
  	};

}	

]);