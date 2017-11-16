/// Uses: basic particle that has all its own unique functions and parameters

'use strict';

var site = site || { };

site.Particle = function (type) {
    
    // constructor
    function Particle(ID, size, resources, stage) {
        this.ID = ID;
        
        // physics parameters
        this.position = {x: 0, y: 0};
        this.velocity = {x: 0, y: 0};
        this.accel =    {x: 0, y: 0};
        this.forces =   {x: 0, y: 0};
        this.physical = { };
        this.gravitational = { };
        
        this.color = 'rgb(255, 200, 80)';    // will be set later
        this.sprite = new PIXI.Sprite(resources['Media/circle_small.png'].texture);
        stage.addChild(this.sprite);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.STATE = 'ALIVE';
        
        // set all values
        randomPos(this, size);
        randomVel(this, size);
        randomColor(this);
        
        
        this.physical.density = 0;
        this.physical.radius = 0;
        this.physical.volume = 0;
        this.physical.mass = 0;
        
        //this.type = type || 'asteroid';
        
        /*  REALISTIC
        this.physical.density = Math.random() * 5.5 + 0.5; // gram per cm^3
        //this.physical.radius = Math.pow(10, Math.abs(gaussian(1, 3))) + 100; // meters
        //if (Math.random() < 0.95) {
            // small bodies
            //this.physical.radius = Math.pow(10, Math.abs(gaussian(1.5, 1))) + 50;
            this.physical.radius = Math.pow(10, Math.random() * 1 + 2);
        } else {
            // larger bodies
            //this.physical.radius = Math.pow(10, Math.abs(gaussian(1.5, 1.5))) + 500;
            this.physical.radius = Math.pow(10, Math.random() * 2 + 2);
        }
        
        // physical properties
        this.physical.volume = 4 / 3 * Math.PI * Math.pow(this.physical.radius, 3); // meter^3
        this.physical.mass = this.physical.volume * 1000 * this.physical.density; // kg
        */
        
        this.physical.mass = Math.pow(10, Math.random() * 2 + 4);
        this.physical.radius = Math.pow(this.physical.mass, 1 / 3);
        this.physical.volume = 4 / 3 * Math.PI * Math.pow(this.physical.radius, 3);
        this.physical.density = this.physical.mass / this.physical.volume / 1000;
        this.physical.min = {x: this.position.x - this.physical.radius,
                             y: this.position.y - this.physical.radius};
        
        this.physical.max = {x: this.position.x + this.physical.radius,
                             y: this.position.y + this.physical.radius};
        this.physical.keys = undefined;
        
        // gravitational properties
        /*  REALISTIC
        this.gravitational.radius = (6.674 * Math.pow(10, -11) * this.physical.mass);
        */
        this.gravitational.radius = this.physical.mass / 10;
        //this.gravitational.attractOthers = true;//(this.gravitational.radius > Math.pow(10, 1));
        this.gravitational.keys = undefined;
        this.gravitational.attractOthers = (this.gravitational.radius > Math.pow(10, 4.8));
        
        sunColor(this);
    } ;
    
    var p = Particle.prototype;
    
        // 'public' use methods
    // update the particles positions and values
    p.update = function(dt, timescale) {
        this.accel.x = this.forces.x / this.physical.mass;
        this.accel.y = this.forces.y / this.physical.mass;
        
        // reset forces
        this.forces.x = this.forces.y = 0;
        
        this.velocity.x += this.accel.x * dt;
        this.velocity.y += this.accel.y * dt;
        
        // reset acceleration
        this.accel.x = this.accel.y = 0;
        
        // update position        
        //if (this.position.x == NaN || this.position.y == NaN)
        //    console.log('ERROR: Positions out of bounds');
        
        this.position.x += this.velocity.x * dt * timescale;
        this.position.y += this.velocity.y * dt * timescale;
        
        // update AABB positions for hashing
        this.physical.min = {x: this.position.x - this.physical.radius,
                             y: this.position.y - this.physical.radius};
        
        this.physical.max = {x: this.position.x + this.physical.radius,
                             y: this.position.y + this.physical.radius};
        
    };
    
    // change the state
    p.setState = function(_state) {
        this.STATE = _state;
    };
    
    // draw particles
    p.draw = function(resources, zoom, viewLoc) {
        this.sprite.width = this.sprite.height = this.physical.radius * 2 * zoom;
        
        if (this.sprite.width > 32)
            this.sprite.texture = resources['Media/circle_large.png'].texture;
        else if (this.sprite.width > 8)
            this.sprite.texture = resources['Media/circle_medium.png'].texture;
        
        this.sprite.x = (this.position.x - viewLoc.x) * zoom;
        this.sprite.y = (this.position.y - viewLoc.y) * zoom;
        
        /*
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc((this.position.x - viewLoc.x) * 0.005, (this.position.y - viewLoc.y) * 0.005, this.physical.radius * 0.005, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        */
    };
    
    // collision checking
    p.checkCollisions = function(obj2) {
        
        // only check if not the same object
        var dist = distanceSq(this, obj2);
        if(dist < Math.pow(this.physical.radius + obj2.physical.radius, 2)) {
            // collision
            return true;
        }
        
        return false; // no collision
    };
    
    // for "merging"
    p.combine = function(obj2) {
        //console.log('momentum obj1: ' + this.mass * (this.velocity.x + this.velocity.y));
        //console.log('momentum obj2: ' + obj2.mass * (obj2.velocity.x + obj2.velocity.y));
        //console.log('total momentum: ' + ((this.mass * (this.velocity.x + this.velocity.y))+ (obj2.mass * (obj2.velocity.x + obj2.velocity.y))) / (this.mass + obj2.mass));
        
        
        var d1 = this.physical.mass / (this.physical.mass + obj2.physical.mass);
        var d2 = obj2.physical.mass / (this.physical.mass + obj2.physical.mass);
        
        if(this.physical.mass >= obj2.physical.mass) {
            // momentum conservation
            this.velocity.x = ((this.velocity.x * this.physical.mass) + (obj2.velocity.x * obj2.physical.mass)) / this.physical.mass;
            
            this.velocity.y = ((this.velocity.y * this.physical.mass) + (obj2.velocity.y * obj2.physical.mass)) / this.physical.mass;
            
            this.physical.density = this.physical.density * d1 + obj2.physical.density * d2;    
            this.physical.mass += obj2.physical.mass;
            this.physical.radius = Math.pow(this.physical.mass, 1/3);
            this.physical.volume = 4 / 3 * Math.PI * Math.pow(this.physical.radius, 3);
            
            this.gravitational.radius = this.physical.mass / 10;
            
            //this.gravitational.radius = (6.674 * Math.pow(10, -11) * this.physical.mass)
            this.gravitational.attractOthers = (this.gravitational.radius > Math.pow(10, 4.8));
            
            sunColor(this);

            return 1;
        }
        else {
            // momentum conservation
            obj2.velocity.x = ((this.velocity.x * this.physical.mass) + (obj2.velocity.x * obj2.physical.mass)) / obj2.physical.mass;
            
            obj2.velocity.y = ((this.velocity.y * this.physical.mass) + (obj2.velocity.y * obj2.physical.mass)) / obj2.physical.mass;
            
            obj2.physical.density = this.physical.density * d1 + obj2.physical.density * d2;
            obj2.physical.mass += this.physical.mass;
            obj2.physical.radius = Math.pow(obj2.physical.mass, 1/3);
            obj2.physical.volume = 4 / 3 * Math.PI * Math.pow(obj2.physical.radius, 3);
            
            obj2.gravitational.radius = obj2.physical.mass / 10;
            
            //obj2.gravitational.radius = (6.674 * Math.pow(10, -11) * obj2.physical.mass)
            obj2.gravitational.attractOthers = (obj2.gravitational.radius > Math.pow(10, 4.8));
            
            sunColor(obj2);
            
            return 2;
        }
    };
    
    // calculate gravitational forces
    p.gravitation = function(obj2, mult) {
        var F = {x: 0, y:0};
        var dist = distanceSq(this, obj2);
        
        var totalF = this.gravitational.radius * obj2.gravitational.radius / dist * mult;
        
        var theta = angleBetween(this, obj2);
        
        F.x = Math.cos(theta) * totalF;
        F.y = Math.sin(theta) * totalF;
        //console.log(F);
        
        applyForce(obj2, F);

        F.x *= -1;
        F.y *= -1;

        applyForce(this, F);
    };
    p.gravitateTowardBin = function (binObj, mult) {
        var F = {x: 0, y:0};
        var dist = distanceSq(this, binObj);
        
        var totalF = this.gravitational.radius * binObj.graviationalRadius / dist * mult;
        
        var theta = angleBetween(this, binObj);
        
        F.x = Math.cos(theta) * totalF;
        F.y = Math.sin(theta) * totalF;

        F.x *= -1;
        F.y *= -1;

        applyForce(this, F);
    };
    
    p.delete = function (stage) {
        stage.removeChild(this.sprite);
        this.sprite.destroy();
    }
    
        // 'private' use methods
    
    // set a random position
    function randomPos(obj, size) {
        obj.position.x = gaussian(size / 2, size / 8);
        obj.position.y = gaussian(size / 2, size / 8);
    };
    // set a random velocity
    function randomVel(obj, size) {
        // figure out the center of the world
        var center = {
            position: {
                x: size / 2,
                y: size / 2
            }
        };
        
        // setup to rotate around that point
        var theta = angleBetween(obj, center);
        
        var CCW = Math.round(Math.random());
        
        if(CCW > 0)
            theta += Math.PI / 2;
        else
            theta -= Math.PI / 2;
        
        var vel = Math.random() * 0.07 - 0.035;
        
        obj.velocity.x = vel * Math.cos(theta);
        obj.velocity.y = vel * Math.sin(theta);
    };
    // set random color
    function randomColor(obj) {
        var R = Math.round(Math.random() * 255);
        var G = Math.round(Math.random() * 255);
        var B = Math.round(Math.random() * 255);
        
        obj.color = 'rgb(' + R + ',' + G + ',' + B + ')';
        obj.sprite.tint = '0x' + rgbToHex(R, G, B);
    };
    // distance squared function
    function distanceSq(p1, p2) {
        var dx = p1.position.x - p2.position.x;
        var dy = p1.position.y - p2.position.y;
        return (Math.pow(dx, 2) + Math.pow(dy, 2));
    };
    // angle between particles function
    function angleBetween(p1, p2) {
        var dx = p1.position.x - p2.position.x;
        var dy = p1.position.y - p2.position.y;
        
        return Math.atan2(dy, dx);
    };
    // adds forces for acceleration
    function applyForce(obj, f) {
        obj.forces.x += f.x;
        obj.forces.y += f.y;
    };
    
    function sunColor(obj) {
        var deadCutOff = 10000000;
        var coldCutOff = 80000000;
        var mediumCutOff = 400000000;
        var hotCutOff = 1000000000;
        
        var R, G, B;
        if(obj.physical.mass < deadCutOff) { // tiny star
            R = Math.round(map(obj.physical.mass, 0, deadCutOff, 70, 80));
            G = Math.round(map(obj.physical.mass, 0, deadCutOff, 60, 55));
            B = Math.round(map(obj.physical.mass, 0, deadCutOff, 60, 35));
        }
        else if(obj.physical.mass < coldCutOff) { // small star
            R = Math.round(map(obj.physical.mass, deadCutOff, coldCutOff, 80, 120));
            G = Math.round(map(obj.physical.mass, deadCutOff, coldCutOff, 55, 100));
            B = Math.round(map(obj.physical.mass, deadCutOff, coldCutOff, 35, 50));
        }
        else if(obj.physical.mass < mediumCutOff) { // small star
            R = Math.round(map(obj.physical.mass, coldCutOff, mediumCutOff, 120, 210));
            G = Math.round(map(obj.physical.mass, coldCutOff, mediumCutOff, 100, 180));
            B = Math.round(map(obj.physical.mass, coldCutOff, mediumCutOff, 50, 80));
        }
        else {
            R = Math.round(map(obj.physical.mass, mediumCutOff, hotCutOff, 210, 255));
            G = Math.round(map(obj.physical.mass, mediumCutOff, hotCutOff, 180, 255));
            B = Math.round(map(obj.physical.mass, mediumCutOff, hotCutOff, 80, 255));
        }
        
        obj.color = 'rgb(' + R + ',' + G + ',' + B + ')';
        obj.sprite.tint = '0x' + rgbToHex(R, G, B);
    };
    
    return Particle;
}();
