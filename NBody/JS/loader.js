/// Uses: handles all loading of properties and loading event handlers

'use strict'

var site = site || { };

window.onload = function(){
    site.main.init();
    site.Window.init();
    site.Input.init();
}