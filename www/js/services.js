angular.module('app.services', [])



.factory('userMoney', [function() {
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