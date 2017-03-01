// Use: sets up all event handlers and manages the website in general

'use strict';

var site = site || { };

site.main = {
    
    init: function () {
        // define variables
        
            /* EVENT HANDLERS */
        
        // attach menu handlers
        var menus = document.querySelectorAll('.menuHandle');
        for(var i = 0; i < menus.length; i++) {
            menus[i].addEventListener('click', menuHandler);
        }
        
        // attach resize event
        window.onresize = resize;
        
        // attach scroll function
        document.querySelector('#worksWrapper').onclick = function() {
            scrollTo(document.querySelector('.projectWrapper'));
        }
        
            /* INIT FUNCTION UPDATES */
        
        resize();
    }
}