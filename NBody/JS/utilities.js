// Uses: generic functions to use for 

'use strict';

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
    var wind = site.Window;
    if (wind !== undefined && wind.renderer !== undefined) {
        var rend = wind.renderer;
        rend.resize(window.innerWidth - 205, window.innerHeight);
        wind.textLines.particleCount.x = window.innerWidth - 220;
        wind.textLines.collCount.x = window.innerWidth - 220;
        wind.textLines.gravCount.x = window.innerWidth - 220;
        wind.textLines.underConstruction.x = window.innerWidth / 2 - 110;
    }
    //document.querySelector('#mainCanvas').width = window.innerWidth;
    //document.querySelector('#mainCanvas').height = window.innerHeight;
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
function drawText(ctx, text, x, y, font, color, align) {
    ctx.save();
    ctx.textAlign = align || 'center';
    ctx.textBaseline = 'middle';
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y, 1000);
    ctx.restore();
}

/// returns mouse position in local coordinate system of element
function getMouse(e){
	var mouse = {};
	mouse.x = e.pageX - e.target.offsetLeft;
	mouse.y = e.pageY - e.target.offsetTop;
	return mouse;
}

/// Gaussian function
function gaussian (mean, stdDev) {
    var val1 = 1 - Math.random();
    var val2 = 1 - Math.random();
    var gaussValue = Math.sqrt(-2 * Math.log(val1)) * Math.cos(2 * Math.PI * val2);
    return mean + stdDev * gaussValue;
}

function rgbToHex (r, g, b) {
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
