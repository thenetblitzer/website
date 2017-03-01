// Uses: generic functions to use for 

'use strict';


var timeOut; // used to get smooth scrolling

/// Generic menu handler
function menuHandler() {
    var open = this.dataset.open;
    
    if (open === 'true') {
        this.dataset.open = 'false';
        this.parentElement.dataset.open = 'false';
    } 
    else if (open === 'false') {
        this.dataset.open = 'true';
        this.parentElement.dataset.open = 'true';
    }
}

/// Resize function
function resize() {
    document.querySelector('#mainCanvas').width = window.innerWidth;//clamp(window.innerWidth, 0, 1280);
    document.querySelector('#mainCanvas').height = window.innerHeight;
    
    var newCenter = {
        x:window.innerWidth / 2,
        y:window.innerHeight / 2
    };
    
    site.Window.fixPositions(newCenter);
}

/// clamps a value between two others
function clamp(val, min, max) {
    if(val < min)
        return min;
    if(val > max)
        return max;
    return val;
}

/// maps a value from an original range to a new range
function map(val, minIn, maxIn, minOut, maxOut) {
    return (val - minIn) * (maxOut - minOut) / (maxIn - minIn) + minOut;
}

/// Basic text drawing for canvas
function drawText(ctx, text, x, y, font, color) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y, 1000);
    ctx.restore();
}

/// returns mouse position in local coordinate system of element
function getMouse(e, elem){
	var mouse = {
        position: {x: 0, y:0}
    };
    
    var rect = elem.getBoundingClientRect();
    
	mouse.position.x = e.clientX - rect.left;
	mouse.position.y = e.clientY - rect.top;
    
	return mouse;
}

///  smooth scrolling function
function scrollTo(elem) {
    if(document.body.scrollTop < elem.offsetTop) {
		window.scrollBy(0, clamp(elem.offsetTop - document.body.scrollTop, 0, 20));
		timeOut = setTimeout(scrollTo,10, elem);
    }
    else if(document.body.scrollTop > elem.offsetTop) {
		window.scrollBy(0, clamp(document.body.scrollTop - elem.offsetTop, 0, 20));
		timeOut = setTimeout(scrollTo, 10, elem);
    }
    else {
        clearTimeout(timeOut);
    }
}