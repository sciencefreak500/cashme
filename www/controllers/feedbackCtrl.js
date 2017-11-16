app.controller('feedbackCtrl', ['$scope', '$state', '$localStorage',
  function($scope, $state, $localStorage){

    if ($localStorage.ratingID){
      firebase.database().ref('Users/').child($localStorage.ratingID).once('value', function(snapshot){
        $scope.other = snapshot.val();
      });

    }

    $scope.rating = {};
    $scope.rating.max = 5;

    // Submit rating
    $scope.submit = function() {

      //Rating count: how many people have rating this person
      if ($scope.other.ratingCount>0){
        $scope.other.ratingCount+=1;
      }
      else{
        $scope.other.ratingCount = 0;
      }

      //Calculate new average rating
      $scope.other.rating = ($scope.other.rating*$scope.other.ratingCount+$scope.rating.rate)/($scope.other.ratingCount+1);

      firebase.database().ref('Users/').child($localStorage.ratingID).update({
        rating: $scope.other.rating
      })
    }


  }

])
