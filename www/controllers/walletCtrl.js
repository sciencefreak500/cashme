app.controller('walletPageCtrl', ['$scope','$state','$http','userMoney','$timeout',

  function ($scope, $state,$http,userMoney,$timeout) {
  	console.log("wallet page");
  	
    $scope.money = {wallet: 0, request: 0};

  	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    $scope.userID = user.uid;
	    $scope.user = {displayName: user.displayName, photoURL: user.photoURL};
      firebase.database().ref('Users').child(user.uid).once('value').then(function(snap){
        $scope.money.wallet = snap.val().wallet;
        $scope.money.request = snap.val().request;
        userMoney.setRequest(snap.val().request);
        userMoney.setWallet(snap.val().wallet);
        firebase.database().ref("Users").child($scope.userID).update({available: true});
    });
      
	    $timeout(function(){$scope.$apply();});
      navigator.geolocation.getCurrentPosition(function(position){
        firebase.database().ref("Users").child($scope.userID).update({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude});
      });
	  }
	});

    $scope.$on('$ionicView.afterEnter', function () {
    console.log('entered?');
        navigator.geolocation.getCurrentPosition(function(position){
        firebase.database().ref("Users").child($scope.userID).update({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude});
      });
        firebase.database().ref("Users").child($scope.userID).update({available: true});
      });

    

  	$scope.requestCash = function(){
  		console.log("requesting cash");
      firebase.database().ref('Users').child($scope.userID).update({
        wallet: $scope.money.wallet, 
        request: $scope.money.request});
  		userMoney.setRequest($scope.money.request);
      $state.go('waiting');
  	};

}	

]);