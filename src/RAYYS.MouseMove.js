'use strict';

import * as THREE from 'three';

export class RayysMouseMove {

  constructor(rayysMouse, controls) {
    this.camera = rayysMouse.camera;

    this.mouse = rayysMouse;
    this.controls = controls || this.mouse.controls;
    this.mouse.controls = undefined; // overtake mouse controls, if any defined

    this.objects = [];
    this.cb = {
      onModeChanged: [],
      onObjectEnter: [],
      onObjectHover: [],
      onObjectLeave: [],
      onBeforeStart: [], //callbacks here may return false to prevent operation
      onPreviewObjectMove: [], //callbacks here may return alternative position
      onObjectMove: [],
      onObjectReleased: [],
      onVoidClick: []
    };
    this.raycaster = new THREE.Raycaster();

    this.translationLimits = new THREE.Vector3();
    this.translationPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
    this.translationPlaneHelper = new THREE.PlaneHelper(this.translationPlane, 10, 0xff0000);

    this.toggle("xz");

    var handleMouseDown = function(pos) {
      this.raycaster.setFromCamera(pos, this.camera);
      var intersects = this.raycaster.intersectObjects(this.objects);
      if (intersects.length > 0) {

        var canProceed = true;
        // check with subscribers, if this object is movable in current context
        for (let i = 0; i < this.cb.onBeforeStart.length; i++) {
          if (this.cb.onBeforeStart[i](intersects[0].object, this) === false) {
            canProceed = false;
          }
        }
        if (!canProceed) return;

        if (this.controls) {
          this.controls.enablePan = false;
          this.controls.enableRotate = false;
        }

        this.pickPoint = intersects[0].point;
        this.pickedObj = intersects[0].object;
        this.objStartPos = this.pickedObj.position.clone();
        this.tranlsationMatrix = new THREE.Matrix4();

        // todo, this has to be adjusted
        this.translationPlane.constant = this.getPlaneConst(this.pickPoint);
      } else {
        if (this.controls) {
          this.controls.enablePan = true;
          this.controls.enableRotate = true;
        }

        this.pickPoint = undefined;
        this.pickedObj = undefined;
        this.objStartPos = undefined;
        this.tranlsationMatrix = undefined;

        for (let i = 0; i < this.cb.onVoidClick.length; i++) {
          this.cb.onVoidClick[i](this);
        }
      }
    };

    var handleMouseMove = function(pos) {
      this.raycaster.setFromCamera(pos, this.camera);
      if (!this.mouse.mouseDown) {
        // hover testing
        var intersects = this.raycaster.intersectObjects(this.objects);

        if (intersects.length > 0) {
          if (!this.hoveredObj) {
            this.hoveredObj = intersects[0].object;

            // let subscribers know that object was hovered by mouse
            for (let i = 0; i < this.cb.onObjectEnter.length; i++) {
              this.cb.onObjectEnter[i](this.hoveredObj, this);
            }
          } else {
            this.hoveredObj = intersects[0].object;

            // let subscribers know that object was hovered by mouse
            for (let i = 0; i < this.cb.onObjectHover.length; i++) {
              this.cb.onObjectHover[i](this.hoveredObj, this);
            }
          }
        } else {
          if (this.hoveredObj) {
            var leftObj = this.hoveredObj;
            this.hoveredObj = undefined;

            // let subscribers know that object was unhovered
            for (let i = 0; i < this.cb.onObjectLeave.length; i++) {
              this.cb.onObjectLeave[i](leftObj, this);
            }
          }
        }
      } else if (this.pickedObj !== undefined) {
        if (this.controls) {
          // this will disable controls completely, including zoom by wheel
          this.controls.enabled = false;
        }

        var line = new THREE.Line3(
          this.raycaster.ray.origin,
          this.raycaster.ray.origin.clone().add(
            this.raycaster.ray.direction.multiplyScalar(this.camera.far)));

        var res = new THREE.Vector3();
        this.translationPlane.intersectLine(line, res);

        var offs = res.sub(this.pickPoint).multiply(this.translationLimits);
        var newObjectPosition = this.objStartPos.clone().add(offs);

        // let subscribers to preview future object position, and correct it as needed 
        // (for example to avoid object collision)
        for (let i = 0; i < this.cb.onPreviewObjectMove.length; i++) {
          var alternativePos = this.cb.onPreviewObjectMove[i](this.pickedObj, newObjectPosition, this);
          if (alternativePos) {
            newObjectPosition.copy(alternativePos);
          }
        }

        // update snap planes for this object
        this.pickedObj.position.copy(newObjectPosition);
        this.pickedObj.updateMatrix();

        // let subscribers know that object was moved
        for (let i = 0; i < this.cb.onObjectMove.length; i++) {
          this.cb.onObjectMove[i](this.pickedObj, this);
        }
      }
    };

    var handleMouseUp = function(pos) {
      if (this.controls) {
        this.controls.enabled = true;
        this.controls.enablePan = true;
        this.controls.enableRotate = true;
      }

      this.pickPoint = undefined;
      this.pickedObj = undefined;
      this.objStartPos = undefined;
      this.tranlsationMatrix = undefined;

      // let subscribers know that object was released by mouse (i.e. not moving anymore)
      for (let i = 0; i < this.cb.onObjectReleased.length; i++) {
        this.cb.onObjectReleased[i](leftObj, this);
      }
    };

    this.mouse.subscribe(
      handleMouseDown.bind(this),
      handleMouseMove.bind(this),
      handleMouseUp.bind(this));
  }

  toggle(mode) {
    if (mode === this.mode) return;

    this.mode = mode;

    var getPlaneConstXZ = function(p) {
      return p.y;
    }
    var getPlaneConstXY = function(p) {
      return p.z;
    }
    var getPlaneConstYZ = function(p) {
      return p.x;
    }

    if (mode === 'x') {
      this.translationLimits.set(1, 0, 0);
      this.translationPlane.normal.set(0, -1, 0);
      this.translationPlaneHelper.color = 0xff0000;
      this.getPlaneConst = getPlaneConstXZ;
    }
    if (mode === 'y') {
      this.translationLimits.set(0, 1, 0);
      this.translationPlane.normal.set(-1, 0, 0);
      this.translationPlaneHelper.color = 0x00ff00;
      this.getPlaneConst = getPlaneConstYZ;
    }
    if (mode === 'z') {
      this.translationLimits.set(0, 0, 1);
      this.translationPlane.normal.set(0, -1, 0);
      this.translationPlaneHelper.color = 0x0000ff;
      this.getPlaneConst = getPlaneConstXZ;
    }
    if (mode === 'xz') {
      this.translationLimits.set(1, 0, 1);
      this.translationPlane.normal.set(0, -1, 0);
      this.translationPlaneHelper.color = 0xffff00;
      this.getPlaneConst = getPlaneConstXZ;
    }
    if (mode === 'xy') {
      this.translationLimits.set(1, 1, 0);
      this.translationPlane.normal.set(0, 0, -1);
      this.translationPlaneHelper.color = 0xffff00;
      this.getPlaneConst = getPlaneConstXY;
    }
    if (mode === 'yz') {
      this.translationLimits.set(0, 1, 1);
      this.translationPlane.normal.set(-1, 0, 0);
      this.translationPlaneHelper.color = 0xffff00;
      this.getPlaneConst = getPlaneConstYZ;
    }

    // let subscribers know that moving mode was changed
    for (let i = 0; i < this.cb.onModeChanged.length; i++) {
      this.cb.onModeChanged[i](this.mode, this);
    }
  }
}

