app.controller('newCardCtrl', function($scope, $state, $http, $timeout){
  //Get client token
  $scope.$on('$ionicView.beforeEnter', function() {
    firebase.auth().onAuthStateChanged(function(user){
      $scope.userID = user.uid;
      $scope.user = {displayName: user.displayName, photoURL: user.photoURL, email: user.email};
    })
    $scope.addNewCard();
  })

  $scope.btnMessage = "Add New Card";


  $scope.addNewCard = function(){
    $http({
      method: 'POST',
      url: 'http://localhost:3000/client_token'
    }).then(function(res) {
      console.log("Successfully got client token")
      $scope.hideNewCard = true;
      console.log(res);

      // Set up braintree

      braintree.dropin.create({
        authorization: res.data.client_token,
        container: document.getElementById("dropin-container")
      }, function(createErr, instance){
        $scope.instance = instance;
        $scope.loadingDropin = false;
      })
    }),
    function error(e){
      console.error(e);
    }
  }

  $scope.submitPaymentMethod = function() {
    if ($scope.instance){
      $scope.instance.requestPaymentMethod(function(err, payload){
        if (err){
          console.error(err);
        }

        var nonce = payload.nonce;
        $scope.btnMessage = "Adding new card..."
        $http({
          method: 'POST',
          url: 'http://localhost:3000/add_payment_method',
          data: {
            "customer_id": $scope.userID,
            "payment_method_nonce": nonce,
            "email": $scope.user.email
          }
        }).then(function(res){
          console.log("response", res);
          $scope.hideNewCard = false;
          $timeout(function() {
            $state.go('settings');
          },4500)
        })
      })
    }
  }



})
