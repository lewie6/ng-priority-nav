'use strict';

angular.module('ngPriorityNav')
  .factory('PriorityNavService', ['$timeout', '$window', '$document', '$rootScope', function($timeout, $window, $document, $rootScope) {

  var
    service = {};

  // from underscore.js
  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  service.debounce = function (func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function () {
      var last = service.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function () {
      context = this;
      args = arguments;
      timestamp = service.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };
  
  service.now = Date.now || function() {
    return new Date().getTime();
  };

  service.style = function(element, styleName){
    var style = element.currentStyle || window.getComputedStyle(element);
    return style[styleName].replace('px','');
  };

  service.getMargins = function (element){
    return parseInt(service.style(element, 'marginRight') || 0) + parseInt(service.style(element, 'paddingLeft') || 0);
  };

  service.getWidth = function (element, getNaturalWidth){
    var width;
    if (getNaturalWidth) { //get natural/auto width
      var originalWidth = element.style.cssText;
      element.style.cssText = 'width:auto !important; display:inline-block !important;';
      width = element.getBoundingClientRect().width + service.getMargins(element);
      element.style.cssText = originalWidth;
    } else {
      width = element.getBoundingClientRect().width + service.getMargins(element);
    }
    return width;
  };

  service.addIds = function (children) {
    angular.forEach(children, function (child, key) {
      if (!angular.element(child).hasClass('vertical-nav')) {
        angular.element(child).attr('data-priority-nav-index', key+1);
      }
    });
  };

  service.getBreakPoint = function (children, breakPoint, horizontalNavWidth) {
    for (var i = 0; children.length > i; i++ ) { //go through horizontal items
      breakPoint += service.getWidth(children[i], true);
      if (breakPoint > horizontalNavWidth) {
        break;
      }
    }
    return {
      breakPoint: breakPoint,
      breakPointIndex: i
    };
  };

  service.sortChildrenAndAppend = function (wrapperElem){
    var children = wrapperElem.children();
    children.sort(function(a, b) {
      return angular.element(a).attr('data-priority-nav-index') > angular.element(b).attr('data-priority-nav-index') ? 1 : -1
    });
    for (var i = 0; i < children.length; ++i) {
      wrapperElem.append(children[i]);
    }
  };


  service.calculatebreakPoint = function (horizontalNav, verticalNav, verticalNavDropDown, verticalNavMoreLinkBubble){
    if(horizontalNav.children().length > 0){
      var horizontalNavWidth = service.getWidth(horizontalNav[0]), //width of whole nav
        hBreakIndex = service.getBreakPoint(horizontalNav.children(), service.getWidth(verticalNav[0]), horizontalNavWidth),
        vBreakIndex = service.getBreakPoint(verticalNavDropDown.children(), hBreakIndex.breakPoint, horizontalNavWidth),
        breakIndex = (hBreakIndex.breakPointIndex + vBreakIndex.breakPointIndex < (horizontalNav.children().length + verticalNavDropDown.children().length)) ?
          hBreakIndex.breakPointIndex + vBreakIndex.breakPointIndex - 1 : //minus 1 for more link
          hBreakIndex.breakPointIndex + vBreakIndex.breakPointIndex;
      angular.forEach(horizontalNav.children(), function(childElem) {
        if (angular.element(childElem).attr('data-priority-nav-index') && parseInt(angular.element(childElem).attr('data-priority-nav-index')) > breakIndex) {
          verticalNavDropDown.append(angular.element(childElem));
        }
      });
      angular.forEach(verticalNavDropDown.children(), function(childElem) {
        if (angular.element(childElem).attr('data-priority-nav-index') && parseInt(angular.element(childElem).attr('data-priority-nav-index')) <= breakIndex) {
          horizontalNav.append(angular.element(childElem));
        }
      });

      service.sortChildrenAndAppend(verticalNavDropDown);
      service.sortChildrenAndAppend(horizontalNav);

      horizontalNav.append(verticalNav); //append it again, so that it is the last item
      if (verticalNavDropDown.children().length > 0) { // if we have vertical items (they dont all fit in horizontal menu)
        verticalNav.removeClass('go-away'); //show it
        verticalNavMoreLinkBubble.text(verticalNavDropDown.children().length); //add count
      } else { //if we have no vertical items (they all fit in horizontal menu)
        verticalNav.addClass('go-away');
        verticalNavMoreLinkBubble.text(''); //add count
      }
    }
  };


  return service;
}]);