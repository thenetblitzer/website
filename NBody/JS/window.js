/// Uses: Handles all canvas drawing

'use strict';

var site = site || { };

site.Window = {
    
    // PIXI variables
    renderer: undefined,
    main: undefined,
    TextureCache: undefined,
    textures: {
        small: 'Media/circle_small.png',
        med: 'Media/circle_medium.png',
        large: 'Media/circle_large.png'
    },
    loader: undefined,
    resources: undefined,
    textLines: undefined,
    
    loading: true,
    
    // particle variables
    particles: [],
    numParticles: 0,
    
    // optimization variables
    physHash: undefined,
    gravHash: undefined,
    physFrametime: 0,
    gravFrametime: 0,
    hashFrametime: 0,
    collisionChecks: 0,
    gravitationChecks: 0,
    gravTable: undefined,
    gravRelation: 90000000,
    physRelation: 5000000,
    
    // timing and information variables
    lastTime: 0,
    dt: 0,
    animationID: 0,
    updater: undefined,
    mover: undefined,
    loadedBind: undefined,
    
    // Changable variables
    timescale: 100000,
    physHashSize: 2500,
    gravHashSize: 100000,
    windowScale: 200000,
    maxNumParticles: 500,
    gravMult: 1,
    
    collisionsBool: true,
    gravityBool: true,
    paused: false,
    
    // Window movement variables
    zoom: 0.01,
    viewportLoc: {
        x: 0,
        y: 0
    },
    moving: false,
    lastMouse: undefined,
    
    
    init: function() {
        //console.log('window.js loaded');
        
            // Set up PIXI
        var height = window.innerHeight;
        var width = window.innerWidth - 205;
        
        this.renderer = PIXI.autoDetectRenderer(width, height,  {backgroundColor:'#000'});
        document.querySelector("#startWrapper").appendChild(this.renderer.view);
        
        document.querySelector('canvas').id = 'mainCanvas';
        var canvas = document.querySelector('#mainCanvas');
        
        this.main = new PIXI.Container();
        this.renderer.autoResize = true;
        this.renderer.width = width;
        
        this.loadedBind = this.finishLoading.bind(this);
        
        this.loader = PIXI.loader;
        this.loader.add([this.textures.small,
                         this.textures.med,
                         this.textures.large]).load(this.loadedBind);
        this.resources = this.loader.resources;
        this.TextureCache = PIXI.utils.TextureCache;
        
        this.textLines = new PIXI.Container();
        
        this.viewportLoc.x = this.renderer.width / 2;
        this.viewportLoc.y = this.renderer.height / 2;
        
        // scope binds
        if (this.updater === undefined) {
            this.updater = this.update.bind(this);
        }
        if (this.mover === undefined) {
            this.mover = this.moveViewport.bind(this);
        }
        if (this.loadedBind === undefined) {
            this.loadedBind = this.finishLoading.bind(this);
        }
        
        // viewport moving
        canvas.onmousedown = function (e) {
            site.Window.moving = true;
        };
        canvas.onmousemove = function (e) {
            site.Window.moveViewport(e);
        };
        canvas.onmouseup = function (e) {
            site.Window.moving = false;
        };
        
        // PIXI Text creation
        {
            var underConstruction = new PIXI.Text('Site under construction', {
                font: '300 Lato',
                fontSize: '1.1em',
                fontStyle: 'normal',
                align: 'center',
                fill: 0xFFFFFF
            });
            underConstruction.anchor.x = 0.5;
            underConstruction.x = this.renderer.width / 2 - 110;
            underConstruction.y = 15;
            
            var pauseText = new PIXI.Text('PAUSED', {
                font: '300 Lato',
                fontSize: '1.4em',
                fontStyle: 'normal',
                align: 'center',
                fill: 0xFFFFFF
            });
            pauseText.anchor.x = 0.5;
            pauseText.anchor.y = 0.5;
            pauseText.x = this.renderer.width / 2 - 110;
            pauseText.y = this.renderer.height / 2;
            pauseText.visible = false;

            var framerate = new PIXI.Text('framerate: ', {
                font: '300 Lato',
                fontSize: '1.1em',
                fontStyle: 'normal',
                align: 'left',
                fill: 0xFFFFFF
            });
            framerate.x = 15;
            framerate.y = 15;

            var phystime = new PIXI.Text('phystime: ', {
                font: '300 Lato',
                fontSize: '1.1em',
                fontStyle: 'normal',
                align: 'left',
                fill: 0xFFFFFF
            });
            phystime.x = 15;
            phystime.y = 30;

            var gravtime = new PIXI.Text('gravtime: ', {
                font: '300 Lato',
                fontSize: '1.1em',
                fontStyle: 'normal',
                align: 'left',
                fill: 0xFFFFFF
            });
            gravtime.x = 15;
            gravtime.y = 45;

            var hashtime = new PIXI.Text('hashtime: ', {
                font: '300 Lato',
                fontSize: '1.1em',
                fontStyle: 'normal',
                align: 'left',
                fill: 0xFFFFFF
            });
            hashtime.x = 15;
            hashtime.y = 60;

            var drawtime = new PIXI.Text('drawtime: ', {
                font: '300 Lato',
                fontSize: '1.1em',
                fontStyle: 'normal',
                align: 'left',
                fill: 0xFFFFFF
            });
            drawtime.x = 15;
            drawtime.y = 75;

            var particleCount = new PIXI.Text('particles: ', {
                font: '300 Lato',
                fontSize: '1.1em',
                fontStyle: 'normal',
                align: 'right',
                fill: 0xFFFFFF
            });
            particleCount.anchor.x = 1;
            particleCount.x = window.innerWidth - 395;
            particleCount.y = 15;

            var collCount = new PIXI.Text('collision checks: ', {
                font: '300 Lato',
                fontSize: '1.1em',
                fontStyle: 'normal',
                align: 'right',
                fill: 0xFFFFFF
            });
            collCount.anchor.x = 1;
            collCount.x = window.innerWidth - 395;
            collCount.y = 30;

            var gravCount = new PIXI.Text('gravity checks: ', {
                font: '300 Lato',
                fontSize: '1.1em',
                fontStyle: 'normal',
                align: 'right',
                fill: 0xFFFFFF
            });
            gravCount.anchor.x = 1;
            gravCount.x = window.innerWidth - 395;
            gravCount.y = 45;

            // attach all text
            //this.textLines.addChild(underConstruction);
            this.textLines.addChild(pauseText);
            this.textLines.addChild(framerate);
            this.textLines.addChild(phystime);
            this.textLines.addChild(gravtime);
            this.textLines.addChild(hashtime);
            this.textLines.addChild(drawtime);
            this.textLines.addChild(particleCount);
            this.textLines.addChild(collCount);
            this.textLines.addChild(gravCount);

            this.textLines.underConstruction = underConstruction;
            this.textLines.pauseText = pauseText;
            this.textLines.framerate = framerate;
            this.textLines.phystime = phystime;
            this.textLines.gravtime = gravtime;
            this.textLines.hashtime = hashtime;
            this.textLines.drawtime = drawtime;
            this.textLines.particleCount = particleCount;
            this.textLines.collCount = collCount;
            this.textLines.gravCount = gravCount;
        }
    },
    
    finishLoading: function () {
        //console.log('Loading finished');
        this.loading = false;
        this.setup();
    },
    
    setup: function () {
        //console.log('Setting up now');
        
        // delete any previous particles
        if (this.particles !== undefined) {
            while (this.particles.length > 0) {
                this.particles[0].delete(this.main);
                this.particles.splice(0, 1);
            }
        }
        
        // make sure no other frames are being drawn
        cancelAnimationFrame(this.animationID);
        
            // initialize hash table
        this.physHash = new physicalHash(this.physHashSize);
        this.gravHash = new gravityHash(this.gravHashSize);
        this.gravTable = new Map();
        this.particles = [];
        
        this.numParticles = this.maxNumParticles;
        this.physHash.updateHashSize(this.physRelation, this.numParticles);
        this.gravHash.updateHashSize(this.gravRelation, this.numParticles);
        
        var min = 1000000000;
        var max = 0;
        var avg = 0;
        var attracting = 0;
        var maxInd = 0;
        
        var t = window.performance.now();
        for (var i = 0; i < this.numParticles; i++) {
            var p = new site.Particle(i, this.windowScale, this.resources, this.main);
            
            Object.preventExtensions(p);
            this.particles.push(p);
            
            avg += this.particles[i].gravitational.radius;
            
            if (this.particles[i].gravitational.radius < min)
                min = this.particles[i].gravitational.radius;
            
            if (this.particles[i].gravitational.radius > max) {
                max = this.particles[i].gravitational.radius;
                maxInd = i;
            }
            
            if (this.particles[i].gravitational.attractOthers)
                attracting++;
        }
        
        avg /= this.particles.length;
        //console.log('Average radius: ' + avg + '  Min: ' + min + '  Max: ' + max + ' at index: ' + maxInd + '  Attracting: ' + attracting);
        
        //console.log('Particle creation: ' + (window.performance.now() - t) + 'ms');
        
        this.viewportLoc.x = this.windowScale / 2 - this.renderer.width / this.zoom / 2;//this.particles[maxInd].position.x;
        this.viewportLoc.y = this.windowScale / 2 - this.renderer.height / this.zoom / 2;//this.particles[maxInd].position.y;
        
        this.main.addChild(this.textLines);
        
        t = window.performance.now();
        
        for (var i = 0; i < this.particles.length; i++) {
            if (this.particles[i].STATE == 'DEAD')
                continue;
            
            if (!this.physHash.insert(this.particles[i])) {
                //console.log('ERROR: Particle at ' + i + ' could not be added to the hash table!');
                //console.dir(this.particles[i]);
                //console.dir(this.hashTable);
            }
            if (!this.gravHash.insert(this.particles[i])) {
                //console.log('ERROR: Particle at ' + i + ' could not be added to the hash table!');
                //console.dir(this.particles[i]);
                //console.dir(this.hashTable);
            }
            
        }
        
        this.gravHash.finalize();
        
        //console.log('Hashing: ' + (window.performance.now() - t) + 'ms');
        
        //console.dir(this.physHash);
        //console.dir(this.gravHash);
        
        this.updater();
    },
    
    // updates all the states of the particles
    update: function() {
        this.animationID = requestAnimationFrame(this.updater);
        
        this.dt = this.calculateDeltaTime();
        
        
            /* COLLISIONS */
        var p1;
        var c = 0;
        
        var t = performance.now();
        
        if (this.collisionsBool) {
            var physTable = new Map();
            var key = 0;

            for (var i = 0; i < this.particles.length; i++) {
                p1 = this.particles[i];

                if (p1.STATE == 'DEAD')
                    continue;

                // collisions
                for (var j = 0; j < p1.physical.keys.length; j++) {
                    var bin = this.physHash.getBin(p1.physical.keys[j]);

                    // go through all bins this object is in
                    for (var k = 0; k < bin.length; k++) {
                        if (bin[k] === p1)
                            continue;

                        if (bin[k].STATE == 'DEAD')
                            continue;

                        if (p1.ID > bin[k].ID)
                            key = p1.ID * this.particles.length * 10 + bin[k].ID;
                        else
                            key = bin[k].ID * this.particles.length * 10 + p1.ID;

                        if (physTable.has(key))
                            continue;

                        physTable.set(key, true);

                        var check = p1.checkCollisions(bin[k]);
                        c++;

                        if (check) {                        
                            if (p1.combine(bin[k]) == 1) {
                                bin[k].setState('DEAD');
                                this.main.removeChild(bin[k].sprite);
                            } else {
                                p1.setState('DEAD');
                                this.main.removeChild(p1.sprite);
                                break;
                            }
                        }
                    }

                    if (p1.STATE == 'DEAD')
                        break;                      // make sure the particle still exists before continuing
                }

                p1.physical.lastFrame = this.animationID;
            }

        }
        this.collisionChecks = c;
        this.physFrametime = performance.now() - t;
        
        c = 0;
        t = performance.now();
        
        
            /* GRAVITATION */
        
        if (this.gravityBool) {
            // get all bins and create object for bin mass
            var key = 0;
            var binVals = Array.from(this.gravHash.getAllBins().keys());
            var massObj = { };

            for (var i = 0; i < this.particles.length; i++) {
                p1 = this.particles[i];
                
                // check to see if particle should even matter
                if (p1.STATE == 'DEAD')
                    continue;

                if (p1.gravitational.attractOthers) {

                    var bin = this.gravHash.getBin(p1.gravitational.keys);

                    // go through all bins this object is in
                    for (var k = 0; k < bin.length; k++) {
                        if (bin[k] === p1)
                            continue;

                        if (bin[k].STATE == 'DEAD')
                            continue;

                        if (p1.ID > bin[k].ID)
                            key = p1.ID * this.particles.length * 10 + bin[k].ID;
                        else
                            key = bin[k].ID * this.particles.length * 10 + p1.ID;

                        if (this.gravTable.has(key))
                            continue;

                        this.gravTable.set(key, true);

                        p1.gravitation(bin[k], this.gravMult);
                        c++;
                    }
                }

                for (var j = 0; j < binVals.length; j++) {
                    if (p1.gravitational.keys == binVals[j]) 
                        continue;

                    massObj = this.gravHash.getBinMassObject(binVals[j]);

                    p1.gravitateTowardBin(massObj, this.gravMult);
                    c++;
                }
            }

        }
        this.gravitationChecks = c;
        this.gravFrametime = performance.now() - t;
        
        
            /* REHASHING */
        
        // rehash the entire thing for now
        t = performance.now();
        
        // reset hashes
        this.physHash.clear();
        this.gravHash.clear();
        this.gravTable.clear();
        
        this.physHash.updateHashSize(this.physRelation, this.numParticles);
        this.gravHash.updateHashSize(this.gravRelation, this.numParticles);
        
        // add each particle back into the hash maps
        for (var i = 0; i < this.particles.length; i++) {
            if(this.particles[i].STATE == 'DEAD')
                continue;
            
            if (!this.physHash.insert(this.particles[i])) {
                //console.log('ERROR: Particle at ' + i + ' could not be added to the hash table!');
                //console.dir(this.particles[i]);
                //console.dir(this.hashTable);
            }
            if (!this.gravHash.insert(this.particles[i])) {
                //console.log('ERROR: Particle at ' + i + ' could not be added to the hash table!');
                //console.dir(this.particles[i]);
                //console.dir(this.hashTable);
            }
            
        }
        
        this.gravHash.finalize();   // calculate the graitation strength
        
        this.hashFrametime = performance.now() - t;
        
        this.draw(this.ctx);
    },
    
    // draws all objects
    draw: function(ctx) {
        
        // counting variables
        var n = 0;
        var t = performance.now();
        
        // update each particle and add to the 'surviving' particle count
        for(var i = 0; i < this.particles.length; i++) {
            if(this.particles[i].STATE == 'DEAD')
                continue;
            
            n++;
            this.particles[i].update(this.dt, this.timescale);
            this.particles[i].draw(this.resources, this.zoom, this.viewportLoc);
        }
        //ctx.restore();
        t = performance.now() - t;        
        
        // update all the debug text
        this.textLines.framerate.text = 'framerate: ' + Math.floor(1 / this.calculateDeltaTime());
        this.textLines.phystime.text = 'phystime: ' + this.physFrametime.toFixed(3);
        this.textLines.gravtime.text = 'gravtime: ' + this.gravFrametime.toFixed(3);
        this.textLines.hashtime.text = 'hashtime: ' + this.hashFrametime.toFixed(3);
        this.textLines.drawtime.text = 'drawtime: ' + t.toFixed(3);
        
        this.textLines.particleCount.text = 'particles: ' + n;
        this.textLines.collCount.text = 'collision checks: ' + this.collisionChecks;
        this.textLines.gravCount.text = 'gravity checks: ' + this.gravitationChecks;
        
        // render the scene
        this.renderer.render(this.main);
    },
    
    // calculates the amount of time passed between frames
    calculateDeltaTime: function() {
		var now, fps;
		now = performance.now(); 
		fps = 1000 / (now - this.lastTime);
		fps = clamp(fps, 5, 60);
		this.lastTime = now; 
		return 1 / fps;
	},
    
        // function to move the local viewport around
    moveViewport: function (e) {
        var mouse = getMouse(e);
        
        if(this.moving && this.lastMouse != undefined) {
            // get change and apply it
            var dx = this.lastMouse.x - mouse.x;
            var dy = this.lastMouse.y - mouse.y;
            
            this.viewportLoc.x += dx / this.zoom;
            this.viewportLoc.y += dy / this.zoom;
        }
        
        this.lastMouse = mouse;
    },
    
    // pauses the program
    pauseProg: function () {
        this.pause = true;
        
        cancelAnimationFrame(this.animationID);
        this.textLines.pauseText.visible = true;
        
        this.renderer.render(this.main);
    },
    
    // resumes the program
    resumeProg: function () {
        this.pause = false;
        
        requestAnimationFrame(this.updater);
        
        this.textLines.pauseText.visible = false;
    }
};