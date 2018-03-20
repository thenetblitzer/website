/// Uses: Handles all canvas drawing

'use strict';

var site = site || {};

site.Window = {
  canvas: undefined,
  ctx: undefined,

  particles: [],
  numParticles: 0,
  interactions: false,
  lastTime: 0,
  dt: 0,
  animationID: 0,
  mouse: {
    position: {
      x: 0,
      y: 0
    }
  },
  center: {
    position: {
      x: 0,
      y: 0
    }
  },

  init: function () {
    //console.log('window.js loaded');

    this.canvas = document.querySelector('#mainCanvas');
    this.ctx = this.canvas.getContext('2d');

    //this.canvas.addEventListener('mousemove', function(e) {
    //    site.Window.mouse = getMouse(e, this);
    //});
    this.mouse.position = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2
    }

    this.fixPositions(this.center);

    this.center.position = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2
    }

    this.numParticles = 200;
    for (var i = 0; i < this.numParticles; i++) {
      var p = new site.Particle(this.center);

      Object.preventExtensions(p);
      this.particles.push(p);
    }

    this.updateBind = this.update.bind(this);
    this.updateBind();
  },
  
  updateBind: undefined,

  update: function () {
    this.animationID = requestAnimationFrame(this.updateBind);

    this.dt = this.calculateDeltaTime();

    for (var i = 0; i < this.particles.length; i++) {
      var p1 = this.particles[i];

      p1.gravitation(this.center, 100000, 0.0005);
    }

    this.draw(this.ctx);
    
    document.querySelectorAll('.curhovered').forEach(function (elem) {
      var timeH = Number.parseFloat(elem.dataset.hovertime);
      timeH += site.Window.dt;
      elem.dataset.hovertime = timeH;
      
      if ((window.devicePixelRatio <= 1 && elem.dataset.hovertime >= 2) || (window.devicePixelRatio > 1 && elem.dataset.hovertime >= 1)) {
        elem.classList = 'projectWrapper active';
        elem.dataset.hovertime = 2;
        elem.querySelector('.projectInfo').dataset.active = true;
      }
    });
    
    document.querySelectorAll('.endhovered').forEach(function (elem) {
      var timeH = Number.parseFloat(elem.dataset.hovertime);
      timeH -= site.Window.dt;
      elem.dataset.hovertime = timeH;
      
      if (elem.dataset.hovertime <= 0) {
        elem.classList = 'projectWrapper';
        elem.dataset.hovertime = 0;
        elem.querySelector('.projectInfo').dataset.active = false;
      }
    });
    
    if (window.devicePixelRatio > 1) {
      var position = document.scrollingElement.scrollTop;
      var bottomPos = position + window.innerHeight;
      
      document.querySelectorAll('.projectWrapper').forEach(function (elem) {
        if (elem.offsetTop > position && (elem.offsetTop + elem.clientHeight) < bottomPos) {
          if (elem.classList.contains('active')) {
            elem.dataset.hovertime = 5;
            elem.classList = 'projectWrapper active';
          } else if (elem.classList != 'projectWrapper curhovered') {
            elem.classList = 'projectWrapper curhovered';
          }
        }
        else {
          if (elem.classList.contains('active')) {
            elem.classList = 'projectWrapper endhovered active';
          } else if (elem.classList != 'projectWrapper') {
            elem.classList = 'projectWrapper endhovered';
          }
        }
      });
    }
  },

  draw: function (ctx) {
    ctx.fillStyle = '#7C8070';
    ctx.fillRect(0, 0, site.Window.canvas.width, site.Window.canvas.height);

    ctx.save();
    for (var i = 0; i < this.particles.length; i++) {
      if (this.particles[i].STATE == 'DEAD')
        continue;

      this.particles[i].update(this.dt);
      this.particles[i].draw(this.ctx);
    }
    ctx.restore();

    drawText(this.ctx, 'Luke Miller', this.canvas.width / 2, clamp(this.canvas.height / 2 - 50, 100, 500), 'normal small-caps 300 4.5em Lato, Arial, sans-serif', 'rgb(255, 255, 255)');
    drawText(this.ctx, 'Game Developer | Web Developer', this.canvas.width / 2, clamp(this.canvas.height / 2 - 50, 100, 500) + 75, 'normal normal 300 1.75em Lato, Arial, sans-serif', 'rgb(255, 255, 255)');
    drawText(this.ctx, 'lukemillergames@gmail.com', this.canvas.width / 2, clamp(this.canvas.height / 2 - 50, 100, 500) + 105, 'normal normal 300 1em Lato, Arial, sans-serif', 'rgb(255, 255, 255)');
    //drawText(this.ctx, 'Site under construction', this.canvas.width / 2, 15, 'normal normal 300 0.7em Lato', 'rgb(255, 255, 255)');
  },

  calculateDeltaTime: function () {
    var now, fps;
    now = performance.now();
    fps = 1000 / (now - this.lastTime);
    fps = clamp(fps, 12, 60);
    this.lastTime = now;
    return 1 / fps;
  },

  fixPositions(newCenter) {
    var dx = site.Window.center.position.x - newCenter.x;
    var dy = site.Window.center.position.y - newCenter.y;

    site.Window.center.position = newCenter;

    for (var i = 0; i < site.Window.particles.length; i++) {
      if (site.Window.particles[i].STATE == 'DEAD')
        continue;

      site.Window.particles[i].shiftPos(dx, dy);
    }

  }
};
