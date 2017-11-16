/// Uses: Quad-tree class

'use strict';


            /* INFO */

    /// creates a new quad in the designated location with a certain size
    /// quads only are able to store up to 4 objects before splitting into new quads
    /// constructor takes a parent quad (if any), and a starting variable (if any) and inserts it

// functions ->
    // insert: places a new variable in the quad and splits it if needed (recursive)
        // takes an object to add
        // puts it in a lower quad if needed
        // calls split if needed
        // returns whether the object was added successfully
    // remove: removes a child from the quad
        // takes an object to remove, OR an index and returns the object
        // calls merge if needed
    // move: removes a child from this quad, then moves it to another quad
        // takes the object (or index) to move and the destination quad
        // removes then inserts
    // split: splits the quad into 4 children quads of equal size and filters the contents
        // splits the quad into 4
        // checks which quad each particle intersects with
        // inserts that particle into the quad
    // merge: combines the child quads into a single quad
    // getChildren: returns all children in the quad and child quads (recursive)
    // getChildCount: returns the count of all children and children in child quads (recursive)
    // intersects: checks for an intersection, and then checks if there's intersections with the children quads (if any) (recursive)
        // takes an object with a .position parameter and a .size parameter, then compares it to this
        // checks if the quad has been split
            // if it has, recursively calls this again on child quads
            // if it hasn't, checks if there's an intersection and returns itself if there has been

var Quad = function () {
    
            /* PROPERTIES */
        // public
    var proto = Quad.prototype; // prototype for adding functions
    
        // private
    // physical properties
    var position = {            // top-left location (absolute position)
        x: 0,
        y: 0
    };
    var size = 0;               // quads are squares, so only need one length definition
    var halfSize = 0;           // used for partitioning to lower quads
    var center = {              // center location (relative location); used in partitioning
        x: 0,
        y: 0
    }
    
    var quadChildren = [];      // child quads
    var objects = [];           // array of contained objects
    var childCount = 0;         // currently count of all stored objects and child quad's objects
    
    
    proto.maxObjectCount = 4;   // maximum allowed objects per quad before it splits
    
    
            /* PROTOTYPE FUNCTIONS */
    // insert function
    proto.insert = function (obj) {
        if (arguments.length === 0)
            return false;                       // no object passed in to insert
        
        if (obj.position === undefined)
            return false;                       // invalid object
        
        // if we make it here, then the object works
        if (this.quadChildren.length > 0) {     // quad has already been split
            var success = false; // variable for returning whether the object was added or not
            
            // loop through all quad children
            for (var i = 0; i < this.quadChildren.length; i++) {
                // check which quad the object intersects with
                var check = this.quadChildren[i].intersects(obj);
                
                if (check === undefined)
                    continue;                   // this child doesn't intersect
                
                // if here, there was an intersection
                    // insert into the child it intersected with
                success = this.quadChildren[i].insert(obj);
                break;
            }
            
            if(success)                         // if the object was added, increase the number of stored children in the tree
                childCount++;
            
            return success; // leave the function
            
        } else {                                // quad hasn't been split yet
            // add the object
            this.objects[this.object.length] = obj;
            // increment total child count
            this.childCount++;
            
            // check if the quad has too many objects now and split if needed
            if (this.childCount > 4) {         // quad needs to split now
                this.split();
            }
            
            return true; // leave the function
        }
    }
    
    proto.remove = function (obj) {
        
    }
    
    proto.move = function (obj, newQuad) {
        
    }
    
    proto.split = function () {
        
    }
    
    proto.merge = function () {
        
    }
    
    // gets all the children from this quad or child quads
    proto.getChildren = function () {
        
    }
    
    // gets the total count of all objects in this quad and child quads
    proto.getChildCount = function () {
        var total = 0; //
        
        if (this.quadChildren.length > 0) {     // quad has split already
            for (var i = 0; i < this.quadChildren.length; i++) {
                // recursively call for each child quad
                total = this.quadChildren[i].getChildCount();
            }
        } else {                                // object hasn't split
            total = this.childCount;
        }
        
        return total; // return the count of this quad's children or all child quad's children
    }
    
    //proto.intersects = function (obj) 
};
