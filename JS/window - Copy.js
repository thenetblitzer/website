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
    
    init: function() {
        console.log('window.js loaded');
        
        this.canvas = document.querySelector('#mainCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.numParticles = 300;
        for(var i = 0; i < this.numParticles; i++) {
            var p = new site.Particle();
            
            
            Object.preventExtensions(p);
            this.particles.push(p);
        }
        
        this.update();
    },
    
    update: function() {
        this.animationID = requestAnimationFrame(this.update.bind(this));
        
        this.dt = this.calculateDeltaTime();
        
        var dead = [];
        var p2;
        
        for(var i = 0; i < this.particles.length; i++) {
            var p1 = this.particles[i];
            
            if(p1.STATE == 'DEAD')
                continue;
            
            for(var j = i + 1; j < this.particles.length; j++) {
                p2 = this.particles[j];
                if(p2.STATE == 'DEAD')
                    continue;
                
                if(p1.checkCollisions(p2)) {
                    var dying = p1.combine(p2);
                    if(dying == 1)
                        p2.setState('DEAD');
                    else        
                        p1.setState('DEAD');
                }
                else {
                    p1.gravitation(p2, 6.64);
                }
            }
        }
        if(dead.length > 0) {
            for(var i = 0; i < dead.length; i++) {
                //this.particles.splice(dead[i], 1);
                this.particles[dead[i]].setState('DEAD');
            }
        }
        
        this.draw(this.ctx);
    },
    
    draw: function(ctx) {
        ctx.fillStyle = 'black';
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
        drawText(this.ctx, 'Game Developer', this.canvas.width / 2, clamp(this.canvas.height / 2 - 50, 100, 500) + 75, 'normal normal 300 1.85em Lato', 'rgb(255, 255, 255)');
        drawText(this.ctx, 'robotscandrawtoo@gmail.com', this.canvas.width / 2, clamp(this.canvas.height / 2 - 50, 100, 500) + 105, 'normal normal 300 1em Lato', 'rgb(255, 255, 255)');
        drawText(this.ctx, 'Site under construction', this.canvas.width / 2, 15, 'normal normal 300 0.7em Lato', 'rgb(255, 255, 255)');
    },
    
    calculateDeltaTime: function() {
		var now, fps;
		now = performance.now(); 
		fps = 1000 / (now - this.lastTime);
		fps = clamp(fps, 12, 60);
		this.lastTime = now; 
		return 1 / fps;
	}
};