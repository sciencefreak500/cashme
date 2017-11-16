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

      $scope.notification = {
        amount: "10",
        body: "Time to make money! Someone near you needs cash!",
        displayName:"Mason man",
        distance:"0.0181131689886347",
        giverID:"ZbQ8aVqOtrfHTjskAhxRG6fv2gq2",
        rating:"5",
        requestID:"ccmCbTagQfSF7HbNhWTB7ph2ZxX2",
        tap:false,
        title:"¢ashMe"
      };

      var myPopup = $ionicPopup.show({
        templateUrl: 'requestPopup.html',
        title: '<h3 class="cashme-title-popup">cashme Alert</h3>',
        subTitle: '<h5><b>'+ $scope.notification.displayName+'</b> needs your service</h5>',
        scope: $scope,
    
        buttons: [
          { text: 'Cancel',
            type: 'button-light'
          }, 
          { text: '<b>Accept</b>',
            type: 'button-balanced',
            onTap: function(e) {
              console.log('what is e',e );
              firebase.database().ref('confirm').push({
                giverPhoto: $scope.user.photoURL,
                giverID: $scope.userID,
                displayName: $scope.user.displayName,
                distance: $scope.notification.distance,
                requestID: $scope.notification.requestID,
                rating: $scope.user.myRating,
                amount: $scope.notification.amount
              });
              navigator.geolocation.getCurrentPosition(function(position){
              firebase.database().ref("Users").child($scope.userID).update({
                longitude: position.coords.longitude,
                latitude: position.coords.latitude});
              });
            }
          }]
      });
              
      window.FirebasePlugin.grantPermission();
      window.FirebasePlugin.onNotificationOpen(function(notification) {
        console.log(notification);
        $scope.notification = notification;
        console.log("notification shows", $scope.notification);
      },function(error) {
          console.error(error);
      });
    });


    //Update my wallet locally and firebase
    $scope.setMyWallet = function(){
      console.log("walletCtrl.js - setting my wallet");
      firebase.database().ref('Users').child($scope.userID).update({
        wallet: $scope.money.wallet
      });
      userMoney.setWallet($scope.money.wallet);
    }

    //update my request locally
    $scope.setMyRequest = function(){
      console.log("walletCtrl.js - setting my request locally");
      userMoney.setRequest($scope.money.request);
    }

    //send and update request
  	$scope.requestCash = function(){
      console.log("requesting cash", $scope.money.request);
      
      if($scope.money.request === null || $scope.money.request === undefined){
        $ionicPopup.alert({
          title: 'Error',
          cssClass: 'ion-alert-pop-up',
          template: 'Requesting amount is empty'
        });
        return;
      }

      firebase.database().ref('Users').child($scope.userID).update({
        wallet: $scope.money.wallet, 
        request: $scope.money.request
      });
      userMoney.setWallet($scope.money.wallet);
      userMoney.setRequest($scope.money.request);
      $state.go('map');
  	};

  }	
]);