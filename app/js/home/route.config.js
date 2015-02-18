(function () {
  'use strict';

  angular
    .module('app.home')
    .config(config);

  config.$inject = ['$urlRouterProvider', '$stateProvider'];

  function config($urlRouterProvider, $stateProvider) {

    $stateProvider
      .state('app', {
        url: '/',

        controller: 'HomeController',
        templateUrl: 'js/home/views/index.html'
      });

    $urlRouterProvider.otherwise('/');

  }

})();
