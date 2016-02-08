'use strict';

angular.module('ngPriorityNav').directive('priorityNav', function($timeout, $window, PriorityNavService){
  return {
    restrict: 'A',
    priority: -999,
    link: function (scope, horizontalNav, attrs) {

      var
        verticalNav =
          angular.element(
            '<div class="vertical-nav">' +
              '<div class="more-link icon-applaud-burger"><span class="bubble"></span></div>' +
              '<div class="vertical-nav-dropdown"></div>' +
            '</div>'
          ),
        verticalNavMoreLink = angular.element(verticalNav[0].querySelector('.more-link')),
        verticalNavDropDown = angular.element(verticalNav[0].querySelector('.vertical-nav-dropdown')),
        verticalNavMoreLinkBubble = angular.element(verticalNav[0].querySelector('.bubble'));

      horizontalNav.addClass('priority-nav');


      var initDebounced = PriorityNavService.debounce(function() {
        init(horizontalNav, verticalNav, verticalNavDropDown, verticalNavMoreLinkBubble, false, 'sss');
      }, 500); // Maximum run of 1 per 500 milliseconds


      function init(horizontalNav, verticalNav, verticalNavDropDown, verticalNavMoreLinkBubble, hardStart){
        horizontalNav.append(verticalNav).addClass('go-away'); //append it hidden so that we can get width
        if (hardStart){ // remove all items (before render)
          verticalNavDropDown.children().remove();
          horizontalNav.children().remove();
        }
        $timeout(function () {
          $timeout(function () { //weird/annoying - but need this to ensure is rendered
            if (hardStart){
              verticalNavMoreLink[0].style.cssText = 'line-height:' + horizontalNav.children()[0].getBoundingClientRect().height + 'px';
              PriorityNavService.addIds(horizontalNav.children());
            }
            PriorityNavService.calculatebreakPoint(horizontalNav, verticalNav, verticalNavDropDown, verticalNavMoreLinkBubble);
            $timeout(function () {
              horizontalNav.removeClass('go-away');
            },200);
          });
        });
      }


      //for dynamic nav items, you can add the binded {{object/model}} into the priorityNav attribute...
      // then if your object/model changes, then we re-run the directive
      if (!attrs.priorityNav){ //normal init
        init(horizontalNav, verticalNav, verticalNavDropDown, verticalNavMoreLinkBubble, true);
      } else { //init with listener
        attrs.$observe('priorityNav', function(val){
          if (val) {
            init(horizontalNav, verticalNav, verticalNavDropDown, verticalNavMoreLinkBubble, true);
          }
        });
      }

      //re-init on
      angular.element($window)
        .on('resize', initDebounced)
        .on('orientationchange', initDebounced);
    }
  };
});