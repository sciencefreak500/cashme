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

