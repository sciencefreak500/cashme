app.controller('loginPageCtrl', ['$scope','$state','$http',

  function ($scope, $state,$http) {
  	console.log("were good now");

  	$scope.user = {email:"", password:""};

  	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    $state.go('settings');
	    $timeout(function(){$scope.$apply();});
	  }
	});


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
  			console.log("error", error.code);
  			if(error.code == "auth/email-already-in-use"){
  				firebase.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(user){
  					console.log("success",user);
  					$state.go('settings');
  				});
  			}
  		});
  	};

}

]);