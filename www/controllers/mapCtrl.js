app.controller('mapCtrl', ['$scope', '$state', '$ionicLoading', '$timeout', '$compile','$http','userMoney','myUser','$firebaseArray',
	function ($scope, $state, $ionicLoading, $timeout, $compile,$http,userMoney,myUser,$firebaseArray) {
        
        //variables
        $scope.user ={};
        $scope.user.meetUpAddress = "";
        $scope.isLooking = false;
        var amount;
        var requested;
        firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
                $scope.userID = user.uid;
                $scope.user = {displayName: user.displayName, photoURL: user.photoURL};	

                firebase.database().ref("Users").child(user.uid).once('value').then(function(success){
                    requested = success.val().request;
                });
				$timeout(function(){$scope.$apply();});

			}
        });

        $scope.$on('$ionicView.beforeEnter', function (){

            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                   firebase.database().ref("Users").child(user.uid).update({available: false});
                }
            });
            amount = userMoney.getRequest();
            $scope.cancelButtonShow = false;

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
                
                var userIcon = {
                    url: $scope.user.photoURL,
                    size: new google.maps.Size(30, 30),
                    scaledSize: new google.maps.Size(30, 30),
                    origin: new google.maps.Point(0,0)
                }

                //make map maker on the map
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    icon: userIcon,
                    draggable:true,
                    optimized:false
                });

                var myoverlay = new google.maps.OverlayView();
                myoverlay.draw = function () {
                    this.getPanes().markerLayer.id='markerLayer';
                };
                myoverlay.setMap($scope.map);

                var geocoder = new google.maps.Geocoder();
                var infowindow = new google.maps.InfoWindow();

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
                // new CustomUserPictureOverLay(latLng, $scope.user.photoURL, $scope.map);


                //autocomplete places 
                var autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'),{componentRestrictions: {country: 'us'}});
                autocomplete.bindTo('bounds', $scope.map);
               
                autocomplete.addListener('place_changed', function() {
                    infowindow.close();
                    marker.setVisible(false);
                    var place = autocomplete.getPlace();
                    
                    if (place.geometry.viewport) {
                        $scope.map.fitBounds(place.geometry.viewport);
                    } else {
                        $scope.map.setCenter(place.geometry.location);
                        $scope.map.setZoom(15);
                    }
                    marker.setPosition(place.geometry.location);
                    marker.setVisible(true);
                    getAddress(geocoder, $scope.map, infowindow, place.geometry.location, marker);

                });

            }, function(error){
               console.log("mapCrtl - Could not get location", error);
            });
        });

        $scope.sendMeetUpAddress = function(){
            $scope.isLooking = true;
             $scope.simplifyList();
        };

        $scope.cancelSendMeetUpAddress = function(){
            $scope.isLooking = false;
        }

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
                div.className = "customMarker";
        
        
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
            $scope.user.meetUpAddress= "";
            geocoder.geocode(
                { 'latLng': latLng },
                function( results, status ) {
                    if ( status == google.maps.GeocoderStatus.OK ) {
                        if(results[0]){
                            console.log("mapCtrl - current address: ", results[0].formatted_address );
                            $scope.user.meetUpAddress = results[0].formatted_address;
                            document.getElementById("autocomplete").value = $scope.user.meetUpAddress;
                            var contentString = '<div ng-click="getDirection(user.meetUpAddress)">'+ 
                                                results[0].formatted_address +
                                                '</div>';
                            var compiled = $compile(contentString)($scope);
                            infowindow.setContent(compiled[0]);
                            infowindow.open(map, marker);
                            $timeout(function(){$scope.$apply();});
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

        function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
                var R = 6371; // Radius of the earth in km
                var dLat = deg2rad(lat2 - lat1); // deg2rad below
                var dLon = deg2rad(lon2 - lon1);
                var a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c; // Distance in km
                return d;
            }

        function deg2rad(deg) {
            return deg * (Math.PI / 180);
        }

        function sendNotifies(withDist, num, ticketNum){
            try{
                firebase.database().ref('notify').push({  //uppermost key = the giver
                    distance: withDist[num].distance, //dist between
                    giverID: withDist[num].info.uid,
                    requestID: $scope.userID,  
                    rating: myUser.getData().rating,
                    displayName: myUser.getData().displayName,
                    amount: myUser.getData().request}).then(function(x){
                    console.log("pushed notify");
                });
                $timeout(function(){
                    console.log("after?");
                    sendNotifies(withDist, num+1, ticketNum);
                },10000);
                
            }catch(err){
                console.log("went too high perhaps", err);
            }
            
        }

        $scope.simplifyList = function(){
            var ref = firebase.database().ref("Users");
            var userData = $firebaseArray(ref);
            var validUsers = [];
            var withDist = [];
            userData.$loaded().then(function(x){
                console.log("user data loaded");
                angular.forEach(userData,function(user){
                    if(amount <= user.wallet && user.uid != $scope.userID && user.available == true){
                        validUsers.push(user);
                    }
                    if(user.uid == $scope.userID){
                        $scope.mylong = user.longitude;
                        $scope.mylat = user.latitude;
                    }
                });
                angular.forEach(validUsers, function(valid){
                    console.log("dist,",$scope.mylat, $scope.mylong, valid.latitude, valid.longitude);
                    if($scope.mylat && $scope.mylong && valid.latitude && valid.longitude){
                        var dist = getDistanceFromLatLonInKm($scope.mylat, $scope.mylong, valid.latitude, valid.longitude);
                        withDist.push({info:valid,distance:dist});
                    }
                    
                });
                withDist.sort(function(a,b){
                    return a['distance'] - b['distance'];
                });
                console.log("with dist and sort", withDist);
                var ticket = {
                    amount: requested,
                    isOpen: true,
                    requestID: myUser.getData().uid,
                    requestPhoto: myUser.getData().photoURL
                };
                firebase.database().ref('ticket').push(ticket).then(function(x){
                    console.log("ticket made",x);
                    sendNotifies(withDist, 0, x.key);
                });
                
                $timeout(function(){
                    $scope.cancelButtonShow = true;
                },15000);
            });
        };

        //cancel the request
        $scope.cancelRequest = function(){
            $state.go('wallet');
        }

    }]);