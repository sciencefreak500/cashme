angular.module('app.routes', ['ui.router'])



.config(function($stateProvider,$urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



.state('login',{
  name: 'Log In',
  url: '/loginPage',
    templateUrl: 'templates/login.html',
    controller: 'loginPageCtrl'
})


.state('wallet',{
  name: 'Wallet',
  url: '/walletPage',
    templateUrl: 'templates/wallet.html',
    controller: 'walletPageCtrl'
})

.state('settings',{
  name: 'Settings',
  url: '/settingsPage',
    templateUrl: 'templates/settings.html',
    controller: 'settingsPageCtrl'
})

.state('waiting',{
  name: 'Waiting',
  url: '/waitingPage',
    templateUrl: 'templates/waiting.html',
    controller: 'waitingPageCtrl'
})



$urlRouterProvider.otherwise('/loginPage')

});
