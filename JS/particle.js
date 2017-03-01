/// Uses: basic particle that has all its own unique functions and parameters

'use strict'

var site = site || { };

site.Particle = function() {
    
    // constructor
    function Particle(center) {
        // physics parameters
        this.position = {x:0, y:0};
        this.velocity = {x:0, y:0};
        this.accel =    {x:0, y:0};
        this.forces =   {x:0, y:0};
        this.mass = undefined;          // will be set later
        this.radius = undefined;        // will be set later
        
        this.color = 'rgb(255, 255, 255)';    // will be set later
        this.STATE = 'ALIVE';
        this.lastDistance = undefined;              // optimization variable
        
        // set all values
        randomPos(this);
        randomVel(this, center);
        //randomColor(this);
        
        this.mass = clamp(Math.random(), 0.25, 1) * 5 * 20;  // will always be squared
        this.radius = Math.sqrt(this.mass / 6);        // doesn't need to be the root
        
        sunColor(this);
    };
    
    var p = Particle.prototype;
    
        // 'public' use methods
    // update the particles positions and values
    p.update = function(dt) {
        
        this.accel.x = this.forces.x / this.mass;
        this.accel.y = this.forces.y / this.mass;
        
        // reset forces
        this.forces.x = this.forces.y = 0;
        
        this.velocity.x += this.accel.x * dt;
        this.velocity.y += this.accel.y * dt;
        
        // reset acceleration
        this.accel.x = this.accel.y = 0;
        
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
    };
    
    // change the state
    p.setState = function(_state) {
        this.STATE = _state;
    };
    
    // draw particles
    p.draw = function(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
            // replace this with something faster
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    };
    
    // collision checking
    p.checkCollisions = function(obj2) {
        
        // only check if not the same object
        var dist = distance(this, obj2);
        if(dist < Math.pow(this.radius + obj2.radius, 2)) {
            // collision
            return true;
        }
        
        this.lastDistance = dist;
        
        return false; // fall through false
    };
    
    // for "merging"
    p.combine = function(obj2) {
        //console.log('momentum obj1: ' + this.mass * (this.velocity.x + this.velocity.y));
        //console.log('momentum obj2: ' + obj2.mass * (obj2.velocity.x + obj2.velocity.y));
        //console.log('total momentum: ' + ((this.mass * (this.velocity.x + this.velocity.y))+ (obj2.mass * (obj2.velocity.x + obj2.velocity.y))) / (this.mass + obj2.mass));
        
        
        if(this.mass >= obj2.mass) {
            // momentum conservation
            this.velocity.x = ((this.velocity.x * this.mass) + (obj2.velocity.x * obj2.mass)) / this.mass;
            this.velocity.y = ((this.velocity.y * this.mass) + (obj2.velocity.y * obj2.mass)) / this.mass;
            
            this.mass += obj2.mass; // make sure the new mass is positive
            this.radius = Math.sqrt(this.mass / 10);
            sunColor(this);

            return 1;
        }
        else {
            // momentum conservation
            obj2.velocity.x = ((this.velocity.x * this.mass) + (obj2.velocity.x * obj2.mass)) / obj2.mass;
            obj2.velocity.y = ((this.velocity.y * this.mass) + (obj2.velocity.y * obj2.mass)) / obj2.mass;
            
            obj2.mass += this.mass; // make sure the new mass is positive
            obj2.radius = Math.sqrt(obj2.mass / 10);
            sunColor(obj2);
            
            return 2;
        }
    };
    
    // calculate gravitational forces
    p.gravitation = function(mouse, massAmt, G) {
        var F = {x: 0, y:0};
        var dist = this.lastDistance || distance(this, mouse);
        this.lastDistance = undefined;
        var totalF = (G * Math.pow(this.mass * massAmt, 2)) / dist / 2000;
            // not actual because floating point precision doesn't allow for that
        
        
        var theta = angleBetween(this, mouse);
        
        F.x = Math.cos(theta) * totalF;
        F.y = Math.sin(theta) * totalF;
        
        F.x *= -1;
        F.y *= -1;

        applyForce(this, F);
    };
    
    // shifts the position of objects when window resizes
    p.shiftPos = function(xShift, yShift) {
        this.position.x -= xShift;
        this.position.y -= yShift;
    };
    
        // 'private' use methods
    
    // set a random position
    function randomPos(obj) {
        obj.position.x = Math.random() * (site.Window.canvas.width - 20) + 10;
        obj.position.y = Math.random() * (site.Window.canvas.height - 10) + 5;
    }
    // set a random velocity
    function randomVel(obj, center) {
        var theta = angleBetween(obj, center);
        
        var CCW = Math.round(Math.random());
        
        if(CCW > 0)
            theta += Math.PI / 2;
        else
            theta -= Math.PI / 2;
        
        var vel = Math.random() * 80 - 40;
        
        obj.velocity.x = vel * Math.cos(theta);
        obj.velocity.y = vel * Math.sin(theta);
    }
    // set random color
    function randomColor(obj) {
        var R = Math.round(Math.random() * 255);
        var G = Math.round(Math.random() * 255);
        var B = Math.round(Math.random() * 255);
        
        obj.color = 'rgb(' + R + ',' + G + ',' + B + ')';
    }
    // distance squared function
    function distance(p1, p2) {
        var dx = p1.position.x - p2.position.x;
        var dy = p1.position.y - p2.position.y;
        return (Math.pow(dx, 2) + Math.pow(dy, 2));
    }
    // angle between particles function
    function angleBetween(p1, p2) {
        var dx = p1.position.x - p2.position.x;
        var dy = p1.position.y - p2.position.y;
        
        return Math.atan2(dy, dx);
    }
    // adds forces for acceleration
    function applyForce(obj, f) {
        obj.forces.x += f.x;
        obj.forces.y += f.y;
    }
    // attempts to map temperature based on mass
    function sunColor(obj) {
        var R, G, B;
        if(obj.mass < 600) { // tiny star
            R = Math.round(map(obj.mass, 0, 600, 30, 50));
            G = Math.round(map(obj.mass, 0, 600, 40, 70));
            B = Math.round(map(obj.mass, 0, 600, 90, 20));
        }
        else if(obj.mass < 7000) { // small star
            R = Math.round(map(obj.mass, 600, 7000, 50, 255));
            G = Math.round(map(obj.mass, 600, 7000, 70, 190));
            B = 20;
        }
        else {
            R = 255
            G = Math.round(map(obj.mass, 7000, 15000, 190, 70));
            B = 20;
        }
        
        obj.color = 'rgb(' + R + ',' + G + ',' + B + ')';
    }
    
    return Particle;
}();