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
          controller: 'loginCtrl'
      })

      .state('wallet',{
        name: 'Wallet',
        url: '/walletPage',
          templateUrl: 'templates/wallet.html',
          controller: 'walletCtrl'
      })

      .state('settings',{
        name: 'Settings',
        url: '/settingsPage',
          templateUrl: 'templates/settings.html',
          controller: 'settingsCtrl'
      })

      .state('waiting',{
        name: 'Waiting',
        url: '/waitingPage',
          templateUrl: 'templates/waiting.html',
          controller: 'waitingCtrl'
      })

      .state('confirmation',{
        name: 'Confirmation',
        url: '/confirmationPage',
          templateUrl: 'templates/confirmation.html',
          controller: 'confirmationCtrl'
      })

      .state('finalConfirmation', {
        name: 'finalConfirmation',
        url: '/finalConfirmationPage',
          templateUrl: 'templates/finalConfirmation.html',
          controller: 'finalConfirmationCtrl'
      })

      .state('feedback', {
        name: 'feedback',
        url: '/feedbackPage',
          templateUrl: 'templates/feedback.html',
          controller: 'feedbackCtrl'
      })

      .state('map', {
        name: 'map',
        url: '/mapPage',
          templateUrl: 'templates/map.html',
          controller: 'mapCtrl'
      });


    $urlRouterProvider.otherwise('/loginPage');

});
