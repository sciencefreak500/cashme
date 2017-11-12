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
      if ($scope.currentUser.uid==requestID){
        firebase.database().ref('ticket').child(ticket.key).update({
          requestConfirmation: true
        })
      }

      else if ($scope.currentUser.uid==giverID){
        firebase.database().ref('')
      }

    }
    $scope.report = function() {
      firebase.database().ref('report').push($localStorage.ticket);
    }


    $scope.alert = function() {

    }







  }])
