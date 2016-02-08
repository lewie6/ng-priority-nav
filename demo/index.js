var app = angular.module('app', ['ngPriorityNav']);

app.controller('MyController', ['$scope', function($scope) {
  var that = this;

  this.navItems = [
    { title: "Nav item 1" },
    { title: "Nav item 2" },
    { title: "Nav item 3" },
    { title: "Nav item 4" },
    { title: "Nav item 5" },
    { title: "Nav item 6" },
    { title: "Nav item 7" },
    { title: "Nav item 8" },
    { title: "Nav item 9" },
    { title: "Nav item 10" }
  ];

}]);