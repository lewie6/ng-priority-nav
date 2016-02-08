var app = angular.module('app', []);

app.controller('MyController', ['$scope', function($scope) {

  var that = this;

  this.navItems = [
    { title: "Nav item 1" },
    { title: "Nav item 2" },
    { title: "Nav item 3" },
    { title: "Nav item 4" },
    { title: "Nav item 5" },
    { title: "Nav item 6" }
  ];

}]);