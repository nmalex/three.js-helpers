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
    this.facingDir = undefined;
    
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

    for (var k = 0; k < this.dirs.length; k++) {
      var dot = this.dirs[k].dot(this.dirVector);
      if (dot > -Math.PI / 2 && dot < Math.PI / 2) {
        var adot = Math.abs(dot);
        if (adot > maxdot) {
          maxdot = dot;
          maxk = k;
        }
      }
    }

		// and if facing direction changed, notify subscribers
    if (maxk !== this.facingDir) {
      var prevDir = this.facingDir;
      this.facingDir = maxk;

      for (var i = 0; i < this.cb.facingDirChange.length; i++) {
        this.cb.facingDirChange[i]({
          before: prevDir,
          current: this.facingDir
        });
      }
    }
  }

  subscribe(onFacingDirChange) {
    this.cb.facingDirChange.push(onFacingDirChange);
  }
}
