app.controller('walletPageCtrl', ['$scope','$state','$http','userMoney',

  function ($scope, $state,$http,userMoney) {
  	console.log("wallet page");
  	$scope.money = {wallet: 1, request: 1};

  	$scope.requestCash = function(){
  		console.log("requesting cash");
  		userMoney.setRequest($scope.money.request);
  	};

}	

]);