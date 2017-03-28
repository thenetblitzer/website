// controls all inputs in the program

'use strict';

var site = site || { };

site.Input = {
    
    init: function () {
        //console.log('input.js loaded');
        
        document.querySelector('#collisions').addEventListener('change', function (e) {
            if (site.Window !== undefined) {
                site.Window.collisionsBool = e.target.checked;
            }
        });
        
        document.querySelector('#gravity').addEventListener('change', function (e) {
            if (site.Window !== undefined) {
                site.Window.gravityBool = e.target.checked;
            }
        });
        
        document.querySelector('#gravityAmount').addEventListener('change', function (e) {
            if (site.Window !== undefined) {
                site.Window.gravMult = (e.target.value);
                document.querySelector('#gravityAmountResults').innerHTML = (e.target.value);
            }
        });
        
        document.querySelector('#timescaleAmount').addEventListener('change', function (e) {
            if (site.Window !== undefined) {
                site.Window.timescale = Math.round(Math.pow(10, (e.target.value)));
                document.querySelector('#timescaleAmountResults').innerHTML = site.Window.timescale + 'x';
            }
        });
        
        document.querySelector('#zoomAmount').addEventListener('change', function (e) {
            if (site.Window !== undefined) {
                site.Window.zoom = e.target.value / 100;
                document.querySelector('#zoomAmountResults').innerHTML = (site.Window.zoom * 100).toFixed(1) + 'x';
            }
        });
        
        document.querySelector('#particleCount').addEventListener('change', function (e) {
            if (site.Window !== undefined) {
                site.Window.maxNumParticles = e.target.value;
                document.querySelector('#particleCountResults').innerHTML = e.target.value;
            }
        });
        
        document.querySelector('#restartButton').addEventListener('click', function (e) {
            if (site.Window !== undefined) {
                site.Window.setup();
            }
        });
    }
};