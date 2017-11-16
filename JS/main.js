// Use: sets up all event handlers and manages the website in general

'use strict';

var site = site || {};

site.main = {

  init: function () {
    // define variables

    /* EVENT HANDLERS */

    // attach menu handlers
    var menus = document.querySelectorAll('.menuHandle');
    for (var i = 0; i < menus.length; i++) {
      menus[i].addEventListener('click', menuHandler);
    }

    // attach resize event
    window.onresize = resize;

    // attach scroll function
    document.querySelector('#worksWrapper').onclick = function () {
      scrollTo(document.querySelector('.projectWrapper'));
    }
    
    // attach project events
    document.querySelectorAll('.projectWrapper').forEach(function (elem) {
      elem.addEventListener('mouseover', projectStartHover);
      elem.addEventListener('mouseout', projectEndHover);
    });

    /* INIT FUNCTION UPDATES */

    resize();
  },
};
  
var projectStartHover = function (e) {
  if (e.target.classList.contains('active')) {
    e.target.dataset.hovertime = 5;
    e.target.classList = 'projectWrapper active';
  } else {
    e.target.classList = 'projectWrapper curhovered';
  }
};
  
var projectEndHover = function (e) {
  if (e.target.classList.contains('active')) {
    e.target.classList = 'projectWrapper endhovered active';
  } else {
    e.target.classList = 'projectWrapper endhovered';
  }
};
