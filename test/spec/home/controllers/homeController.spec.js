'use strict';

describe('homeController', function() {

  beforeEach(module('app.home'));

  var homeController, scope;

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    homeController = $controller('HomeController', {
      $scope: scope
    });
  }));

  it('should have HomeController on title', function() {
    expect(scope.title).toBe('HomeController');
  });

});
