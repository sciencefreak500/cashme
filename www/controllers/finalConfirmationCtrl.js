app.controller('finalConfirmationCtrl', ['$scope', '$state', '$localStorage',
  function($scope, $state, $localStorage){
    firebase.auth().onAuthStateChanged(function(firebaseUser){
      $scope.currentUser = firebaseUser;
    })
    if ($localStorage.ticket){
      $scope.ticket = $localStorage.ticket;

    }


    $scope.cancel = function() {
      $localStorage.ticket = null;
      $state.go('wallet');
    }

    $scope.confirm = function() {
      //Update confirmation of the ticket
      if ($scope.currentUser.uid==$scope.ticket.requestID){
        firebase.database().ref('ticket').child(ticket.key).update({
          requestConfirmation: true
        })
        //Pass the ID of the person that the user will rate
        $localStorage.ratingID = $scope.ticket.giverID;
      }

      else if ($scope.currentUser.uid==$scope.ticket.giverID){
        firebase.database().ref('ticket').child(ticket.key).update({
          giverConfirmation: true
        })
        //Pass the ID of the person that the user will rate
        $localStorage.ratingID = $scope.ticket.requestID;
      }


      $state.go('feedback');

    }
    $scope.report = function() {
      firebase.database().ref('report').push($localStorage.ticket);
    }







  }])
