# ng-priority-nav
A Priority Navigation design pattern component for AngularJs. No dependancies.

[DEMO](http://lewie6.github.io/ng-priority-nav/) (need to improve this!)

Simple AngularJs directive that turns your navigation into the priority navigation design pattern...

What is the priority navigation design pattern?... Say you have 10 navigation items in your horizontal navigation, but only 6 fit inside the width of the navigation, then you get a little "more link" at the end of the items. 
When you click on the more link, you can see the remaining 4 items in a vertical dropdown.
Probably easier to see this [DEMO](http://lewie6.github.io/ng-priority-nav/)


Download the source from dist and include it in your project, then include the module
```
angular.module('app', ['ngPriorityNav']);
```
Or use Bower (coming soon)

# Example usage:

Simple usage:
```HTML
<div ng-priority-nav>
  <div ng-repeat="navItem in navItems">{{navItem.title}}</div>
</div>
```
Or Dynamic?... this will listen for changes to your model and re-apply the directive:
```HTML
<div ng-priority-nav="{{navItems}}">
  <div ng-repeat="navItem in navItems">{{navItem.title}}</div>
</div>
```
You can add some css classes (in addition to the default ones) :
* ng-priority-nav-class
* ng-priority-nav-more-link-class
* ng-priority-nav-drop-down-class
* ng-priority-nav-bubble-class

Is a bit basic at the moment, with a few simple options... To improve!

Has high level unit tests, could probably do with few more.
