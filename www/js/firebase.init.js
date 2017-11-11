angular.module('firebaseConfig', ['firebase'])

.run(function(){

    var config = {
    apiKey: "AIzaSyB41jdT1VaWHkHvTm-kzyks8m8c4jynYZE",
    authDomain: "cashme-1c9ee.firebaseapp.com",
    databaseURL: "https://cashme-1c9ee.firebaseio.com",
    projectId: "cashme-1c9ee",
    storageBucket: "cashme-1c9ee.appspot.com",
    messagingSenderId: "642608123618"
  };
  firebase.initializeApp(config);

})





