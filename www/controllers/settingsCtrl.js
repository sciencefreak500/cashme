app.controller('settingsPageCtrl', ['$scope','$state','$http','$timeout',

  function ($scope, $state,$http,$timeout) {
  	
  	$scope.user = {displayName: '', photoURL: ''};
  	$scope.userID;

  	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    $scope.userID = user.uid;
	    $scope.user = {displayName: user.displayName, photoURL: user.photoURL};
	    $timeout(function(){$scope.$apply();});
	  }
	});


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

}	

]);