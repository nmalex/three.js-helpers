// this class will report you which plane is facing the camera
// TODO: can be extended to handle any collection of directions,
// TODO: can be implemented on GPU for huge dataset
class RayysFacingCamera {
  constructor() {
    // camera looking direction will be saved here
    this.dirVector = new THREE.Vector3();

    // all world directions
    this.dirs = [
      new THREE.Vector3(+1, 0, 0),
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, +1, 0),
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, 0, +1),
      new THREE.Vector3(0, 0, -1)
    ];

    // index of best facing direction will be saved here
    this.facingDirs = [];
    this.bestFacingDir = undefined;
    
    // TODO: add other facing directions too

    // event listeners are collected here
    this.cb = {
      facingDirChange: []
    };
  }

  check(camera) {
    camera.getWorldDirection(this.dirVector);
    this.dirVector.negate();

    var maxk = 0;
    var maxdot = -1e19;

    var oldFacingDirs = this.facingDirs;
    var facingDirsChanged = false;
    this.facingDirs = [];
	
    for (var k = 0; k < this.dirs.length; k++) {
      var dot = this.dirs[k].dot(this.dirVector);
      if (dot > -Math.PI / 2 && dot < Math.PI / 2) {
	this.facingDirs.push(k);
	if (oldFacingDirs.indexOf(k) === -1) {
	  facingDirsChanged = true;
	}
        if (Math.abs(dot) > maxdot) {
          maxdot = dot;
          maxk = k;
        }
      }
    }

    // and if facing direction changed, notify subscribers
    if (maxk !== this.bestFacingDir || facingDirsChanged) {
      var prevDir = this.bestFacingDir;
      this.bestFacingDir = maxk;

      for (var i = 0; i < this.cb.facingDirChange.length; i++) {
        this.cb.facingDirChange[i]({
          before: { facing: oldFacingDirs, best: prevDir },
          current: { facing: this.facingDirs, best: this.bestFacingDir }
        }, this);
      }
    }
  }
}
