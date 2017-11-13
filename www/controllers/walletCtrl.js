app.controller('walletPageCtrl', ['$scope','$state','$http','userMoney','$timeout','$ionicPlatform','$ionicPopup','myUser',

  function ($scope, $state,$http,userMoney,$timeout,$ionicPlatform,$ionicPopup,myUser) {
  	console.log("wallet page");
  	
    $scope.money = {wallet: 0, request: 0};

  	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    $scope.userID = user.uid;
	    $scope.user = {displayName: user.displayName, photoURL: user.photoURL};
      firebase.database().ref('Users').child(user.uid).once('value').then(function(snap){
        $scope.myRating = snap.val().rating;
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


    $scope.$on('$ionicView.beforeEnter', function () {

              
        window.FirebasePlugin.grantPermission();
        window.FirebasePlugin.onNotificationOpen(function(notification) {
              console.log(notification);
              $scope.notification = notification;

              var myPopup = $ionicPopup.show({
               templateUrl: '/templates/popup/requestPopup.html',
               title: '<h3>Cashme Alert</h3>',
               subTitle: '<h4>'+ $scope.notification.displayName+' needs your service</h4>',
               scope: $scope,
            
               buttons: [
                  { text: 'Cancel' }, {
                     text: '<b>Accept</b>',
                     type: 'button-positive',
                     onTap: function(e) {
                        console.log('what is e',e );
                        firebase.database().ref('confirm').push({
                          giverPhoto: $scope.user.photoURL,
                          giverID: $scope.userID,
                          displayName: $scope.user.displayName,
                          distance: $scope.notification.distance,
                          requestID: $scope.notification.requestID,
                          rating: $scope.myRating
                        });
                        navigator.geolocation.getCurrentPosition(function(position){
                        firebase.database().ref("Users").child($scope.userID).update({
                          longitude: position.coords.longitude,
                          latitude: position.coords.latitude});
                     });
                  }
                }
               ]
            });
              

          }, function(error) {
              console.error(error);
          });
        
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