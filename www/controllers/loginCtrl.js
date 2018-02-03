app.controller('loginCtrl', ['$scope','$state','$http','$timeout',

  function ($scope, $state,$http,$timeout) {

		//user login credential info
  	$scope.user = {email:"", password:""};
  	firebase.auth().onAuthStateChanged(function(user) {
	  	if (user) {
	    	$state.go('settings');
	    	$timeout(function(){$scope.$apply();});
	  	}
		});

		//error message for login
		$scope.error = {message:""};
  	$scope.loginUser = function(){
  		console.log("loginCtrl.js - login user");
			
			//create new account 
			firebase.auth().createUserWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(user){
  			console.log("loginCtrl.js - successful logged in for new user", user);
  			userobj = {
  				uid: user.uid,
  				email: user.email,
          userCreated: firebase.database.ServerValue.TIMESTAMP,
          rating: 5
  			};
  			firebase.database().ref('Users').child(user.uid).update(userobj).then(function(x){
  				console.log("loginCtrl.js - created a new user");
  				$state.go('settings');
  			});

  		}).catch(function(error){
  			console.log("loginCtrl.js - error log in ", error);
				
				//sign in with exiting account
				if(error.code == "auth/email-already-in-use"){
  				firebase.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(user){
  					console.log("loginCtrl.js - success logged in with existing user",user);
  					$state.go('settings');
  				}).catch(function(err){
            console.log("loginCtrl.js - ", err.message);
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