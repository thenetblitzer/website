<<<<<<< HEAD
// Use: sets up all event handlers and manages the website in general

'use strict';

var site = site || { };

site.main = {
    
    init: function () {
        //console.log('main.js loaded');
        // define variables
        
            /* EVENT HANDLERS */
        
        // attach menu handlers
        var menus = document.querySelectorAll('.menuHandle');
        for(var i = 0; i < menus.length; i++) {
            menus[i].addEventListener('click', menuHandler);
        }
        
        // attach resize event
        window.addEventListener('resize', resize);
        
        // onblur and onfocus events
        window.addEventListener('blur', function (e) {
            site.Window.pauseProg();
        });
        window.addEventListener('focus', function (e) {
            site.Window.resumeProg();
        });
        
            /* INIT FUNCTION UPDATES */
        
        resize();
    }
=======
// Use: sets up all event handlers and manages the website in general

'use strict';

var site = site || { };

site.main = {
    
    init: function () {
        //console.log('main.js loaded');
        // define variables
        
            /* EVENT HANDLERS */
        
        // attach menu handlers
        var menus = document.querySelectorAll('.menuHandle');
        for(var i = 0; i < menus.length; i++) {
            menus[i].addEventListener('click', menuHandler);
        }
        
        // attach resize event
        window.addEventListener('resize', resize);
        
        // onblur and onfocus events
        window.addEventListener('blur', function (e) {
            site.Window.pauseProg();
        });
        window.addEventListener('focus', function (e) {
            site.Window.resumeProg();
        });
        
            /* INIT FUNCTION UPDATES */
        
        resize();
    }
>>>>>>> a44ceef3da2b174d3933fd3ecee47fd726bc6832
}