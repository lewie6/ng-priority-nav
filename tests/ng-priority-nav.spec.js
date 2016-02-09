'use strict';

ddescribe('ngPriorityNav module: ', function() {
  var
    $rootScope,
    $scope,
    $compile,
    $timeout,
    $window,
    PriorityNavService,
    verticalNav,
    verticalNavMoreLink,
    verticalNavDropDown,
    verticalNavMoreLinkBubble,
    priorityNavDom;

  beforeEach(function() {
    module('ngPriorityNav');
    inject(function(_$rootScope_, _$compile_, _$timeout_, _$window_, _PriorityNavService_) {
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $timeout = _$timeout_;
      $compile = _$compile_;
      $window = _$window_;
      PriorityNavService = _PriorityNavService_
    });


    spyOn(PriorityNavService, 'debounce').and.callFake(function (func) {
      return function () {
        func.apply(this, arguments);
      };
    });

    $scope.navItems = [
      { title: "Nav item 1" },
      { title: "Nav item 2" },
      { title: "Nav item 3" },
      { title: "Nav item 4" },
      { title: "Nav item 5" },
      { title: "Nav item 6" }
    ];

    //an instance of priority nav
    priorityNavDom = angular.element(
      '<div priority-nav="{{navItems}}" style="width:300px">' +
        '<div ng-repeat="i in navItems">{{i.title}}</div>' +
      '</div>');

    //compile it
    priorityNavDom = $compile(priorityNavDom)($scope);

    //append to dom so directive can work on it
    $('body').append(priorityNavDom);
    $timeout.flush();

    //set some vars
    verticalNav = angular.element(priorityNavDom[0].querySelector('.vertical-nav'));
    verticalNavDropDown = angular.element(verticalNav[0].querySelector('.vertical-nav-dropdown'));
    verticalNavMoreLink = angular.element(verticalNav[0].querySelector('.more-link'));
    verticalNavMoreLinkBubble = angular.element(verticalNav[0].querySelector('.bubble'));
  });
  it('should remove overflowed items from horizontal nav', function() {
    //should contain 2 nav items and 1 more link
    expect(priorityNavDom.children().length).toEqual(3);
  });
  it('should put overflowed items in dropdown', function() {
    //should contain 4 nav items
    expect(verticalNavDropDown.children().length).toEqual(4);
  });
  it('should put overflowed items in dropdown on window resize', function() {
    expect(priorityNavDom.children().length).toEqual(3);
    expect(verticalNavDropDown.children().length).toEqual(4);
    priorityNavDom[0].style.cssText = 'width:100px';
    window.dispatchEvent(new Event('resize'));
    $timeout.flush();
    expect(priorityNavDom.children().length).toEqual(1);
    expect(verticalNavDropDown.children().length).toEqual(6);
    priorityNavDom[0].style.cssText = 'width:300px';
    window.dispatchEvent(new Event('orientationchange'));
    $timeout.flush();
    expect(priorityNavDom.children().length).toEqual(3);
    expect(verticalNavDropDown.children().length).toEqual(4);
  });
  it('should update on model change', function() {
    expect(priorityNavDom.children().length).toEqual(3);
    expect(verticalNavDropDown.children().length).toEqual(4);
    $scope.navItems.push({ title: "Nav item 7" });
    $timeout.flush();
    expect(priorityNavDom.children().length).toEqual(3);
    expect(verticalNavDropDown.children().length).toEqual(5);
  });
  it('should add correct more button text', function() {
    expect(verticalNavMoreLink.text()).toEqual('4');
  });
  it('should add correct more line height', function() {
    expect(verticalNavMoreLink[0].style.cssText).toEqual('line-height: ' + priorityNavDom.children()[0].getBoundingClientRect().height + 'px;');
  });


});
