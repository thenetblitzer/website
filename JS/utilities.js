// Uses: generic functions to use for 

'use strict';

/// Generic menu handler
function menuHandler() {
  var open = this.dataset.open;

  if (open === 'true') {
    this.dataset.open = 'false';
    this.parentElement.dataset.open = 'false';
  } else if (open === 'false') {
    this.dataset.open = 'true';
    this.parentElement.dataset.open = 'true';
  }
}

/// Resize function
function resize() {
  document.querySelector('#mainCanvas').width = Math.min(1440, window.innerWidth) / window.devicePixelRatio; //clamp(window.innerWidth, 0, 1280);
  document.querySelector('#mainCanvas').height = window.innerHeight / window.devicePixelRatio;

  var newCenter = {
    x: document.querySelector('#mainCanvas').width / 2,
    y: document.querySelector('#mainCanvas').height / 2
  };

  site.Window.fixPositions(newCenter);
}

/// clamps a value between two others
function clamp(val, min, max) {
  if (val < min)
    return min;
  if (val > max)
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
function getMouse(e, elem) {
  var mouse = {
    position: {
      x: 0,
      y: 0
    }
  };

  var rect = elem.getBoundingClientRect();

  mouse.position.x = e.clientX - rect.left;
  mouse.position.y = e.clientY - rect.top;

  return mouse;
}

///  smooth scrolling function
function scrollTo(elem) {
  
  var start = document.scrollingElement.scrollTop;
  var goal = elem.offsetTop;
  var time = 0;
  var t = 0;
  
  var goToBind = function goTo () {
    var y = lerp(start, goal, t);
    
    //document.scrollingElement.scrollTop = y;
    //document.body.scrollTop = document.scrollingElement.scrollTop;
    document.body.scrollTop = y;
    
    
    t = time*time*time * (time * (6 * time - 15) + 10);
    time += site.Window.dt;
    
    if (time < 1) {
      requestAnimationFrame(goToBind);
    }
  }.bind(this);
  
  requestAnimationFrame(goToBind);
}

function lerp(a, b, t) {
  return ((b * t) + ((1 - t) * a));
}
