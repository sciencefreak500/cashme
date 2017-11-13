angular.module('app.services', [])



.factory('otherUser', [function() {
    var user;

    
    return{
        getData: function(){

            return user;
        },
        setuser: function(x){
            walletValue = x;
        }
    };

  }])


.factory('myUser', [function() {
    var userInfo;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.database().ref("Users").child(user.uid).once('value').then(function(snap){
            userInfo = snap.val();
        });
        }
    });


    
    return{
        getData: function(){

            return userInfo;
        }
    };

  }])




.factory('userMoney', ['$timeout',function($timeout) {
    var walletValue;
    var requestValue;

    
    return{
    	getWallet: function(){

    		return walletValue;
    	},
    	getRequest: function(){
    		return requestValue;
    	},
    	setWallet: function(x){
    		walletValue = x;
    	},
    	setRequest: function(x){
    		requestValue = x;
    	}
    };

  }])

