app.controller('mapCtrl', ['$scope', '$state', '$ionicLoading', '$timeout', '$compile',
	function ($scope, $state, $ionicLoading, $timeout, $compile) {
        
        //variables
        $scope.user ={}
        $scope.user.meetUpAddress = "";

        firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
                $scope.userID = user.uid;
                $scope.user = {displayName: user.displayName, photoURL: user.photoURL};				
				$timeout(function(){$scope.$apply();});
			}
        });

        var options = {timeout: 10000, enableHighAccuracy: true};

        $scope.$on('$ionicView.beforeEnter', function (){
            //getting current user's locations
            navigator.geolocation.getCurrentPosition(function(position){
            
                var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                var mapOptions = {
                    center: latLng,
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
            
                $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
                
                //current user's image on map
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
                    type: 'circle'
                  };
    
                //make map maker on the map
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    // icon: 'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png',
                    shape: shape,
                    draggable:true,
                    title:"Drag me!",
                    class: "user-pic"
                });
    
                var geocoder = new google.maps.Geocoder;
                var infowindow = new google.maps.InfoWindow;

                //recenter the map
                $scope.map.addListener('center_changed', function() {
                    window.setTimeout(function() {
                        $scope.map.panTo(marker.getPosition());
                    }, 7000);
                });

                //update address when move marker
                google.maps.event.addListener(marker, 'dragend', function(event) {
                    latLng = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
                    getAddress(geocoder, $scope.map, infowindow, latLng, marker);
                });

                //get address from current location of the marker
                getAddress(geocoder, $scope.map, infowindow, latLng, marker);

                //draw user and other user pictures on map
                new CustomUserPictureOverLay(latLng, $scope.user.photoURL, $scope.map);

            }, function(error){
               console.log("mapCrtl - Could not get location", error);
            });
        });

        CustomUserPictureOverLay.prototype = new google.maps.OverlayView();

        function CustomUserPictureOverLay(latlng, image, map){
            // Initialize all properties.
            this.latlng_ = latlng;
            this.imageSrc = image;
            this.map_ = map;

            // Define a property to hold the image's div. We'll
            // actually create this div upon receipt of the onAdd()
            // method so we'll leave it null for now.
            this.div_ = null;

            // Explicitly call setMap on this overlay.
            this.setMap(map);
        }

        CustomUserPictureOverLay.prototype.draw = function () {
            // Check if the div has been created.
            var div = this.div_;
            if (!div) {
                // Create a overlay text DIV
                div = this.div_ = document.createElement('div');
                // Create the DIV representing our CustomMarker
                div.className = "customMarker"
        
        
                var img = document.createElement("img");
                img.src = this.imageSrc;
                div.appendChild(img);
                google.maps.event.addDomListener(div, "click", function (event) {
                    google.maps.event.trigger(me, "click");
                });
        
                // Then add the overlay to the DOM
                var panes = this.getPanes();
                panes.overlayImage.appendChild(div);
            }
        
            // Position the overlay 
            var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
            if (point) {
                div.style.left = point.x + 'px';
                div.style.top = point.y + 'px';
            }
        };
        
        CustomUserPictureOverLay.prototype.remove = function () {
            // Check if the overlay was on the map and needs to be removed.
            if (this.div_) {
                this.div_.parentNode.removeChild(this.div_);
                this.div_ = null;
            }
        };
        
        CustomUserPictureOverLay.prototype.getPosition = function () {
            return this.latlng_;
        };


        //getting directions on native
        $scope.getDirection = function(address){
            console.log("mapCtr - getting directions...");
            launchnavigator.navigate(address);
        };

        //getting current address 
        function getAddress(geocoder, map, infowindow, latLng, marker){
            geocoder.geocode(
                { 'latLng': latLng },
                function( results, status ) {
                    if ( status == google.maps.GeocoderStatus.OK ) {
                        if(results[0]){
                            console.log("mapCtrl - current address: ", results[0].formatted_address );
                            $scope.user.meetUpAddress = results[0].formatted_address;
                            var contentString = '<div ng-click="getDirection(user.meetUpAddress)">'
                                                +results[0].formatted_address
                                                +'</div>';
                            var compiled = $compile(contentString)($scope)
                            infowindow.setContent(compiled[0]);
                            infowindow.open(map, marker);
                            $scope.$apply();
                        }else{
                            alert('No results found');
                        }
                    }else{
                        alert('Geocoder failed due to: ' + status);
                    }
                }
            );
        }

        function showLoadingIndicator(){
            $ionicLoading.show({
                template: '<div class="loader"></div>',
                }).then(function(){
                    
            });
        }

        function hideLoadingIndicator(){
            $ionicLoading.hide().then(function(){
                console.log("The loading indicator is now hidden");
            });
        }

    }]);