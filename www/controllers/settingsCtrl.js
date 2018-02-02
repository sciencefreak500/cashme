app.controller('settingsCtrl', ['$scope','$state','$http','$timeout',

  function ($scope, $state,$http,$timeout) {

    $scope.$on('$ionicView.beforeEnter', function() {


      // firebase.auth().onAuthStateChanged(function(user){
      //   userRef = firebase.database().ref('Users/'+user.uid);
      //
      //   //--------------------------Get messaging token------------------------------
      //   window.FirebasePlugin.grantPermission();
      //   window.FirebasePlugin.getToken(function(token) {
      //         // save this server-side and use it to push notifications to this device
      //         console.log("got the token", token);
      //         userRef.update({
      //           messageToken: token
      //         });
      //
      //     }, function(error) {
      //         console.error(error);
      //     });
      //     window.FirebasePlugin.onTokenRefresh(function(token) {
      //         // save this server-side and use it to push notifications to this device
      //         console.log("got the token", token);
      //         userRef.update({
      //           messageToken: token
      //         });
      //
      //     }, function(error) {
      //         console.error(error);
      //     });
      //
      // });

    });


  	$scope.user = {displayName: '', photoURL: ''};
  	$scope.userID;

  	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    $scope.userID = user.uid;
	    $scope.user = {displayName: user.displayName, photoURL: user.photoURL, email: user.email};
      console.log("user", $scope.user);
	    $timeout(function(){$scope.$apply();});
	  }
	});
//Get client token
function getClientToken(){
  $http({
    method: 'POST',
    url: 'http://localhost:3000/client_token'
  }).then(function(res) {
    console.log("Successfully got client token")
    console.log(res);

    // Set up braintree

    braintree.dropin.create({
      authorization: res.data.client_token,
      container: document.getElementById("dropin-container")
    }, function(createErr, instance){
      $scope.instance = instance;
    })
  }),
  function error(e){
    console.error(e);
  }
}

getClientToken();
$scope.submitPaymentMethod = function() {
  if ($scope.instance){
    $scope.instance.requestPaymentMethod(function(err, payload){
      if (err){
        console.error(err);
      }

      var nonce = payload.nonce;
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
      })
    })
  }
}




	function b64toBlob(b64Data, contentType, sliceSize) {
	  contentType = contentType || '';
	  sliceSize = sliceSize || 512;

	  var byteCharacters = atob(b64Data);
	  var byteArrays = [];

	  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
	    var slice = byteCharacters.slice(offset, offset + sliceSize);

	    var byteNumbers = new Array(slice.length);
	    for (var i = 0; i < slice.length; i++) {
	      byteNumbers[i] = slice.charCodeAt(i);
	    }

	    var byteArray = new Uint8Array(byteNumbers);

	    byteArrays.push(byteArray);
	  }

	  var blob = new Blob(byteArrays, {type: contentType});
	  return blob;
	}

  	$scope.getImage = function(){
  		navigator.camera.getPicture(camSuccess, camFail, {
		    quality : 95,
		    destinationType : Camera.DestinationType.DATA_URL,
		    sourceType : Camera.PictureSourceType.CAMERA,
		    allowEdit : true,
		    encodingType: Camera.EncodingType.JPEG,
		    targetWidth: 100,
		    targetHeight: 100,
		    correctOrientation: true,
		    saveToPhotoAlbum: false
		  });

  		function camSuccess(picture){
  			var blob = b64toBlob(picture, 'image/jpg');
  			//+ $scope.userID + '.png'
  				//console.log("picture is", picture);
		    	firebase.storage().ref('profiles').child($scope.userID + '.jpg').put(blob,
		    		{contentType: 'image/jpg'}).then(function(savedPic){
		    		firebase.database().ref('Users').child($scope.userID).update({photoURL: savedPic.downloadURL});
		    		$scope.user.photoURL = savedPic.downloadURL;
		    	});
		    	$timeout(function(){$scope.$apply();});

		  }

		function camFail(error){
		    // Log an error to the console if something goes wrong.
		    console.log("ERROR -> " + JSON.stringify(error));
		  }
  	};

  	$scope.saveInfo = function(){
  		console.log("saving info");
  		firebase.database().ref('Users').child($scope.userID).update({displayName: $scope.user.displayName});
  		firebase.auth().currentUser.updateProfile({
  			displayName: $scope.user.displayName,
  			photoURL: $scope.user.photoURL
  		}).then(function(success){
  			console.log("new stuff set", firebase.auth().currentUser.displayName);
  			$state.go('wallet');
  		});
  	};


  	$scope.signOut = function(){
  		console.log("signout");
  		firebase.auth().signOut().then(function(success){
  			console.log("out");
  			$state.go('login');
  		});
		};

	}

]);
