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

    //Handle payment
    var token = "eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiJmMmRjOTgwYzc3ZjFiMDI0MWIxMTlkOTFmZWZkOThhYjIyZWM4OGE4NmI3ZmUxNGFmODY0NWNhMGYzNzlhNmNkfGNyZWF0ZWRfYXQ9MjAxNy0xMS0xMVQyMToyNjo1Ni43NTAwNzk4NDcrMDAwMFx1MDAyNm1lcmNoYW50X2lkPXM1dDltYzM4OWdibXBtcThcdTAwMjZwdWJsaWNfa2V5PWZzN3F4cm5oeTJmZnAzaGQiLCJjb25maWdVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvczV0OW1jMzg5Z2JtcG1xOC9jbGllbnRfYXBpL3YxL2NvbmZpZ3VyYXRpb24iLCJjaGFsbGVuZ2VzIjpbXSwiZW52aXJvbm1lbnQiOiJzYW5kYm94IiwiY2xpZW50QXBpVXJsIjoiaHR0cHM6Ly9hcGkuc2FuZGJveC5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzL3M1dDltYzM4OWdibXBtcTgvY2xpZW50X2FwaSIsImFzc2V0c1VybCI6Imh0dHBzOi8vYXNzZXRzLmJyYWludHJlZWdhdGV3YXkuY29tIiwiYXV0aFVybCI6Imh0dHBzOi8vYXV0aC52ZW5tby5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tIiwiYW5hbHl0aWNzIjp7InVybCI6Imh0dHBzOi8vY2xpZW50LWFuYWx5dGljcy5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tL3M1dDltYzM4OWdibXBtcTgifSwidGhyZWVEU2VjdXJlRW5hYmxlZCI6dHJ1ZSwicGF5cGFsRW5hYmxlZCI6dHJ1ZSwicGF5cGFsIjp7ImRpc3BsYXlOYW1lIjoiQ2FzaG1lIiwiY2xpZW50SWQiOm51bGwsInByaXZhY3lVcmwiOiJodHRwOi8vZXhhbXBsZS5jb20vcHAiLCJ1c2VyQWdyZWVtZW50VXJsIjoiaHR0cDovL2V4YW1wbGUuY29tL3RvcyIsImJhc2VVcmwiOiJodHRwczovL2Fzc2V0cy5icmFpbnRyZWVnYXRld2F5LmNvbSIsImFzc2V0c1VybCI6Imh0dHBzOi8vY2hlY2tvdXQucGF5cGFsLmNvbSIsImRpcmVjdEJhc2VVcmwiOm51bGwsImFsbG93SHR0cCI6dHJ1ZSwiZW52aXJvbm1lbnROb05ldHdvcmsiOnRydWUsImVudmlyb25tZW50Ijoib2ZmbGluZSIsInVudmV0dGVkTWVyY2hhbnQiOmZhbHNlLCJicmFpbnRyZWVDbGllbnRJZCI6Im1hc3RlcmNsaWVudDMiLCJiaWxsaW5nQWdyZWVtZW50c0VuYWJsZWQiOnRydWUsIm1lcmNoYW50QWNjb3VudElkIjoiY2FzaG1lIiwiY3VycmVuY3lJc29Db2RlIjoiVVNEIn0sIm1lcmNoYW50SWQiOiJzNXQ5bWMzODlnYm1wbXE4IiwidmVubW8iOiJvZmYifQ==";
    $scope.requestPaymentMethod = function() {
      braintree.dropin.create({
        authorization: token,
        container: '#dropin-container'
      }, function(createErr, clientInstance){
          if (createErr) {
            console.error('Error creating client:', clientErr);
            return;
          }
          console.log("no error creating braintree client!");
          clientInstance.requestPaymentMethod(function (err, payload) {
            // Submit payload.nonce to your server
          });


          //-----------FUCKING VENMO, DOESN'T WORK SHIT
          // braintree.venmo.create({
          //   client: clientInstance,
          //   allowNewBrowserTab: false
          // }, function(venmoErr, venmoInstance){
          //   // Stop if there was a problem creating Venmo.
          //   // This could happen if there was a network error or if it's incorrectly
          //   // configured.
          //   if (venmoErr){
          //     console.log("fuck");
          //     console.log('Error creating Venmo: ', venmoErr);
          //     return;
          //   }
          //
          // })
      })


    }



}

]);
