class RayysBBoxGeometry {
    create(bbox, color) {
      if (color === undefined) color = 0x000000;
  
      var node = new THREE.Object3D();
  
      var geom = new THREE.Geometry();
  
      var dx = (bbox.max.x - bbox.min.x);
      var dy = (bbox.max.y - bbox.min.y);
      var dz = (bbox.max.z - bbox.min.z);
  
      var space = 0.75;
      var sdx = dx * (1-space);
      var sdy = dy * (1-space);
      var sdz = dz * (1-space);
      var slen = Math.min(sdx, sdy, sdz);
      
      var offs = 0.05 * (Math.min(dx, dy, dz) + Math.max(dx, dy, dz)) / 2;
  
          // make segments along X-axis
      {
        geom.vertices.push(new THREE.Vector3(bbox.min.x-offs, bbox.min.y-offs, bbox.min.z-offs));
        geom.vertices.push(new THREE.Vector3(bbox.min.x+slen, bbox.min.y-offs, bbox.min.z-offs));
  
        geom.vertices.push(new THREE.Vector3(bbox.min.x-offs, bbox.min.y-offs, bbox.max.z+offs));
        geom.vertices.push(new THREE.Vector3(bbox.min.x+slen, bbox.min.y-offs, bbox.max.z+offs));
  
        geom.vertices.push(new THREE.Vector3(bbox.min.x-offs, bbox.max.y+offs, bbox.min.z-offs));
        geom.vertices.push(new THREE.Vector3(bbox.min.x+slen, bbox.max.y+offs, bbox.min.z-offs));
  
        geom.vertices.push(new THREE.Vector3(bbox.min.x-offs, bbox.max.y+offs, bbox.max.z+offs));
        geom.vertices.push(new THREE.Vector3(bbox.min.x+slen, bbox.max.y+offs, bbox.max.z+offs));
    //
        geom.vertices.push(new THREE.Vector3(bbox.max.x+offs, bbox.min.y-offs, bbox.min.z-offs));
        geom.vertices.push(new THREE.Vector3(bbox.max.x-slen, bbox.min.y-offs, bbox.min.z-offs));
  
        geom.vertices.push(new THREE.Vector3(bbox.max.x+offs, bbox.min.y-offs, bbox.max.z+offs));
        geom.vertices.push(new THREE.Vector3(bbox.max.x-slen, bbox.min.y-offs, bbox.max.z+offs));
  
        geom.vertices.push(new THREE.Vector3(bbox.max.x+offs, bbox.max.y+offs, bbox.min.z-offs));
        geom.vertices.push(new THREE.Vector3(bbox.max.x-slen, bbox.max.y+offs, bbox.min.z-offs));
  
        geom.vertices.push(new THREE.Vector3(bbox.max.x+offs, bbox.max.y+offs, bbox.max.z+offs));
        geom.vertices.push(new THREE.Vector3(bbox.max.x-slen, bbox.max.y+offs, bbox.max.z+offs));
      }
  
          // make segments along Y-axis
      {
        geom.vertices.push(new THREE.Vector3(bbox.min.x-offs, bbox.min.y-offs, bbox.min.z-offs));
        geom.vertices.push(new THREE.Vector3(bbox.min.x-offs, bbox.min.y+slen, bbox.min.z-offs));
  
        geom.vertices.push(new THREE.Vector3(bbox.min.x-offs, bbox.min.y-offs, bbox.max.z+offs));
        geom.vertices.push(new THREE.Vector3(bbox.min.x-offs, bbox.min.y+slen, bbox.max.z+offs));
  
        geom.vertices.push(new THREE.Vector3(bbox.max.x+offs, bbox.min.y-offs, bbox.min.z-offs));
        geom.vertices.push(new THREE.Vector3(bbox.max.x+offs, bbox.min.y+slen, bbox.min.z-offs));
  
        geom.vertices.push(new THREE.Vector3(bbox.max.x+offs, bbox.min.y-offs, bbox.max.z+offs));
        geom.vertices.push(new THREE.Vector3(bbox.max.x+offs, bbox.min.y+slen, bbox.max.z+offs));
    //
        geom.vertices.push(new THREE.Vector3(bbox.min.x-offs, bbox.max.y+offs, bbox.min.z-offs));
        geom.vertices.push(new THREE.Vector3(bbox.min.x-offs, bbox.max.y-slen, bbox.min.z-offs));
  
        geom.vertices.push(new THREE.Vector3(bbox.min.x-offs, bbox.max.y+offs, bbox.max.z+offs));
        geom.vertices.push(new THREE.Vector3(bbox.min.x-offs, bbox.max.y-slen, bbox.max.z+offs));
  
        geom.vertices.push(new THREE.Vector3(bbox.max.x+offs, bbox.max.y+offs, bbox.min.z-offs));
        geom.vertices.push(new THREE.Vector3(bbox.max.x+offs, bbox.max.y-slen, bbox.min.z-offs));
  
        geom.vertices.push(new THREE.Vector3(bbox.max.x+offs, bbox.max.y+offs, bbox.max.z+offs));
        geom.vertices.push(new THREE.Vector3(bbox.max.x+offs, bbox.max.y-slen, bbox.max.z+offs));
      }
  
          // make segments along Z-axis
      {
        geom.vertices.push(new THREE.Vector3(bbox.min.x-offs, bbox.min.y-offs, bbox.min.z-offs));
        geom.vertices.push(new THREE.Vector3(bbox.min.x-offs, bbox.min.y-offs, bbox.min.z+slen));
  
        geom.vertices.push(new THREE.Vector3(bbox.min.x-offs, bbox.max.y+offs, bbox.min.z-offs));
        geom.vertices.push(new THREE.Vector3(bbox.min.x-offs, bbox.max.y+offs, bbox.min.z+slen));
  
        geom.vertices.push(new THREE.Vector3(bbox.max.x+offs, bbox.min.y-offs, bbox.min.z-offs));
        geom.vertices.push(new THREE.Vector3(bbox.max.x+offs, bbox.min.y-offs, bbox.min.z+slen));
  
        geom.vertices.push(new THREE.Vector3(bbox.max.x+offs, bbox.max.y+offs, bbox.min.z-offs));
        geom.vertices.push(new THREE.Vector3(bbox.max.x+offs, bbox.max.y+offs, bbox.min.z+slen));
    //
        geom.vertices.push(new THREE.Vector3(bbox.min.x-offs, bbox.min.y-offs, bbox.max.z+offs));
        geom.vertices.push(new THREE.Vector3(bbox.min.x-offs, bbox.min.y-offs, bbox.max.z-slen));
  
        geom.vertices.push(new THREE.Vector3(bbox.min.x-offs, bbox.max.y+offs, bbox.max.z+offs));
        geom.vertices.push(new THREE.Vector3(bbox.min.x-offs, bbox.max.y+offs, bbox.max.z-slen));
  
        geom.vertices.push(new THREE.Vector3(bbox.max.x+offs, bbox.min.y-offs, bbox.max.z+offs));
        geom.vertices.push(new THREE.Vector3(bbox.max.x+offs, bbox.min.y-offs, bbox.max.z-slen));
  
        geom.vertices.push(new THREE.Vector3(bbox.max.x+offs, bbox.max.y+offs, bbox.max.z+offs));
        geom.vertices.push(new THREE.Vector3(bbox.max.x+offs, bbox.max.y+offs, bbox.max.z-slen));
      }
  
      var line = new THREE.LineSegments(geom, new THREE.LineBasicMaterial({
        color: color
      }));
      line.name = "bbox";
      node.add(line);
  
      return node;
    }
  }
  