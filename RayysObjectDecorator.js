class RayysObjectDecorator {
	constructor() {
  	// many different decorators may apply at this point,
    // for example decorated obect may be:
    // 1. set color red,
    // 2. present own wireframe,
    // 3. have bounding box wrapper
    // 4. attached move/rotate/scale gizmo
  	this.decorators = {
    	material: undefined,
      children: undefined
    };
    
    // collect decorated objects with info how to undecorate them
  	this.decorated = {
    	material: {},
      children: {}
    };
  }

  decorate(object) {
    // now apply decorators one by one
    this.decorated.material[object.id] = {
      ref: object,               // reference on decorated object
      material: object.material, // backup initial material
    };
    object.material = this.decorators.material(object);

		// attach decorating child geometry
    var dChildren = this.decorators.children(object);
    this.decorated.children[object.id] = {
    	ref: object,
      children: dChildren
    };
    for (let i=0; i<dChildren.length; i++) {
    	object.add(dChildren[i]);
    }
  }
  
  reset(object) {
  	if (object === undefined) { // reset for all
    	// replace decorated material with initial material
      for (let id in this.decorated.material) {
        this.decorated.material[id].ref.material = this.decorated.material[id].material;
        delete this.decorated.material[id];
      }
      
      // now remove all decorating child nodes
      for (let id in this.decorated.children) {
      	var decoratedObj = this.decorated.children[id].ref;
        for (let i=0; i<this.decorated.children[id].children.length; i++) {
        	let dNode = this.decorated.children[id].children[i];
          decoratedObj.remove(dNode);
        }
        delete this.decorated.children[id];
      }
    } else { // reset for given object
    	// restore material
      object.material = this.decorated.material[object.id].material;
      delete this.decorated.material[object.id];
      // remove decorate child nodes

      for (let i=0; i<this.decorated.children[id].children.length; i++) {
        let dNode = this.decorated.children[id].children[i];
        object.remove(dNode);
      }
      delete this.decorated.children[id];
    }
  }
}
