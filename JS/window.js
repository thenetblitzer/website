/// Uses: Handles all canvas drawing

'use strict';

var site = site || { };

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
        position: {x:0, y:0}
    },
    center: {
        position: {x:0, y:0}
    },
    
    init: function() {
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
        for(var i = 0; i < this.numParticles; i++) {
            var p = new site.Particle(this.center);
            
            Object.preventExtensions(p);
            this.particles.push(p);
        }
        
        this.update();
    },
    
    update: function() {
        this.animationID = requestAnimationFrame(this.update.bind(this));
        
        this.dt = this.calculateDeltaTime();
        
        for(var i = 0; i < this.particles.length; i++) {
            var p1 = this.particles[i];
            
            p1.gravitation(this.center, 100000, 0.0005);
        }
        
        this.draw(this.ctx);
    },
    
    draw: function(ctx) {
        ctx.fillStyle = '#7C8070';
        ctx.fillRect(0, 0, site.Window.canvas.width, site.Window.canvas.height);
        
        ctx.save();
        for(var i = 0; i < this.particles.length; i++) {
            if(this.particles[i].STATE == 'DEAD')
                continue;
            
            this.particles[i].update(this.dt);
            this.particles[i].draw(this.ctx);
        }
        ctx.restore();
        
        drawText(this.ctx, 'Luke Miller', this.canvas.width / 2, clamp(this.canvas.height / 2 - 50, 100, 500), 'normal small-caps 300 4.5em Lato', 'rgb(255, 255, 255)');
<<<<<<< HEAD
        drawText(this.ctx, 'Game Developer | Web Developer', this.canvas.width / 2, clamp(this.canvas.height / 2 - 50, 100, 500) + 75, 'normal normal 300 1.85em Lato', 'rgb(255, 255, 255)');
        drawText(this.ctx, 'ljm1896@rit.edu', this.canvas.width / 2, clamp(this.canvas.height / 2 - 50, 100, 500) + 105, 'normal normal 300 1em Lato', 'rgb(255, 255, 255)');
        //drawText(this.ctx, 'Site under construction', this.canvas.width / 2, 15, 'normal normal 300 0.7em Lato', 'rgb(255, 255, 255)');
=======
        drawText(this.ctx, 'Game Developer', this.canvas.width / 2, clamp(this.canvas.height / 2 - 50, 100, 500) + 75, 'normal normal 300 1.85em Lato', 'rgb(255, 255, 255)');
        drawText(this.ctx, 'ljm1896@rit.edu', this.canvas.width / 2, clamp(this.canvas.height / 2 - 50, 100, 500) + 105, 'normal normal 300 1em Lato', 'rgb(255, 255, 255)');
        drawText(this.ctx, 'Site under construction', this.canvas.width / 2, 15, 'normal normal 300 0.7em Lato', 'rgb(255, 255, 255)');
>>>>>>> a44ceef3da2b174d3933fd3ecee47fd726bc6832
    },
    
    calculateDeltaTime: function() {
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
        
        for(var i = 0; i < site.Window.particles.length; i++) {
            if(site.Window.particles[i].STATE == 'DEAD')
                continue;
            
            site.Window.particles[i].shiftPos(dx, dy);
        }
        
    }
};
