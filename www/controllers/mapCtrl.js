app.controller('mapCtrl', ['$scope', '$state',
	function ($scope, $state) {
    
        var latLng;

        firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
                $scope.userID = user.uid;
                $scope.user = {displayName: user.displayName, photoURL: user.photoURL};				
				$timeout(function(){$scope.$apply();});
			}
        });
        
        var options = {timeout: 10000, enableHighAccuracy: true};
        
        navigator.geolocation.getCurrentPosition(function(position){
        
            latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        
           var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
           };
        
            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
            
            var image = {
                url: $scope.user.photoURL,
                // This marker is 20 pixels wide by 32 pixels high.
                size: new google.maps.Size(71, 71),
                // The origin for this image is (0, 0).
                origin: new google.maps.Point(0, 0),
                // The anchor for this image is the base of the flagpole at (0, 32).
                anchor: new google.maps.Point(0, 32)
            };

            var shape = {
                coords: [1, 1, 1, 20, 18, 20, 18, 1],
                type: 'poly'
              };

            var marker = new google.maps.Marker({
                position: latLng,
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                icon: image,
                shape: shape,
                draggable:true,
                title:"Drag me!"
            });
            
            $scope.map.addListener('center_changed', function() {
                // 3 seconds after the center of the map has changed, pan back to the
                // marker.
                window.setTimeout(function() {
                    $scope.map.panTo(marker.getPosition());
                }, 10000);
            });

         }, function(error){
           console.log("Could not get location", error);
         });

    }]);