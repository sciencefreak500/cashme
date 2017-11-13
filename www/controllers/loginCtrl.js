app.controller('loginPageCtrl', ['$scope','$state','$http','$timeout',

  function ($scope, $state,$http,$timeout) {
  	console.log("were good now");

  	$scope.user = {email:"", password:""};

  	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    $state.go('settings');
	    $timeout(function(){$scope.$apply();});
	  }
	});

    $scope.error = {message:""};
  	$scope.loginUser = function(){
  		console.log("login user");
  		firebase.auth().createUserWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(user){
  			console.log("success",user);
  			userobj = {
  				uid: user.uid,
  				email: user.email
  			};
  			firebase.database().ref('Users').child(user.uid).update(userobj).then(function(x){
  				console.log("created obj");
  				$state.go('settings');
  			});

  		}).catch(function(error){
  			console.log("error", error);
  			if(error.code == "auth/email-already-in-use"){
  				firebase.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(user){
  					console.log("success",user);
  					$state.go('settings');
  				}).catch(function(err){
            console.log("trying to sign-in,", err.message);
            $scope.error.message = err.message;
            $timeout(function(){$scope.$apply();});
          });
  			}
        else{
          $scope.error.message = error.message;
        }
        
  		});
  	};

}

]);