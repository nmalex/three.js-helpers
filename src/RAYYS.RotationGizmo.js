'use strict';

import * as THREE from 'three';
import { RayysMouse } from './RAYYS.Mouse'

export class RayysRotationGizmo {
    constructor() {
        this.matrix = new THREE.Matrix4();
    }

  init(renderer, camera, controls, radius = 1) {
    this.radius = radius;
    this.origin = new THREE.Vector3(0, 0, 0);
    this.gizmo = new THREE.Object3D();
    this.gizmo.renderOrder = 0;
    this.gizmo.scale.set(2,2,2)

		var geometry = new THREE.SphereBufferGeometry(this.radius - 1e-2, 32, 32);
    var material = new THREE.MeshBasicMaterial({
      //color: 0x00000,
      //transparent: true,
      //opacity: 0.0,
      depthTest: true,
      colorWrite: false,
    });
    var sphere = new THREE.Mesh(geometry, material);
    sphere.renderOrder = 9999;
    // sphere.layers.set(2);
    this.gizmo.add(sphere);

    var gizmoCircles = []; // sphere

    // X-plane curve
    var curve = new THREE.EllipseCurve(
      0, 0, // ax, aY
      this.radius, this.radius, // xRadius, yRadius
      0, 2 * Math.PI, // aStartAngle, aEndAngle
      false, // aClockwise
      0 // aRotation
    );

    var points = curve.getPoints(90);
    var geometry = new THREE.BufferGeometry().setFromPoints(points);
    var material = new THREE.LineBasicMaterial({
      color: 0xff0000,
      depthWrite: false,
    });
    var ellipseX = new THREE.Line(geometry, material);
    gizmoCircles.push(ellipseX);
    ellipseX.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    //ellipseX.layers.set(1);
    ellipseX.renderOrder = 9999;
    this.gizmo.add(ellipseX);

    // Y-plane curve
    var curve = new THREE.EllipseCurve(
      0, 0, // ax, aY
      this.radius, this.radius, // xRadius, yRadius
      0, 2 * Math.PI, // aStartAngle, aEndAngle
      false, // aClockwise
      0 // aRotation
    );

    var points = curve.getPoints(90);
    var geometry = new THREE.BufferGeometry().setFromPoints(points);
    var material = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      depthWrite: false,
    });
    var ellipseY = new THREE.Line(geometry, material);
    gizmoCircles.push(ellipseY);
    //ellipseY.layers.set(1);
    ellipseY.renderOrder = 9999;
    this.gizmo.add(ellipseY);

    // Z-plane curve
    var curve = new THREE.EllipseCurve(
      0, 0, // ax, aY
      radius, radius, // xRadius, yRadius
      0, 2 * Math.PI, // aStartAngle, aEndAngle
      false, // aClockwise
      0 // aRotation
    );

    var points = curve.getPoints(90);
    var geometry = new THREE.BufferGeometry().setFromPoints(points);
    var material = new THREE.LineBasicMaterial({
      color: 0x0000ff,
      depthWrite: false,
    });
    var ellipseZ = new THREE.Line(geometry, material);
    gizmoCircles.push(ellipseZ);
    ellipseZ.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI / 2));
    //ellipseZ.layers.set(1);
    ellipseZ.renderOrder = 9999;
    this.gizmo.add(ellipseZ);

    var geom = new THREE.Geometry();
    geom.vertices.push(new THREE.Vector3(0, 0, 0));
    geom.vertices.push(new THREE.Vector3(0, 1, 0));
    geom.vertices.push(new THREE.Vector3(0, 0, 0));
    geom.vertices.push(new THREE.Vector3(0, 1, 0));
    var startSeg = new THREE.LineSegments(geom, new THREE.LineBasicMaterial({
      color: 0x000000
    }));
    startSeg.name = "startSeg";
    // gizmo.add(startSeg);

    var points_geom = new THREE.Geometry();
    points_geom.vertices.push(new THREE.Vector3(0, 0, 0));
    points_geom.vertices.push(new THREE.Vector3(0, 0, 0));
    var points = new THREE.Points(points_geom, new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.15
    }));
    // scene.add(points);

    //angle arc
    var makeGizmoArc = function(from, to, isClockwise) {
      let curve = new THREE.EllipseCurve(
        0, 0, // ax, aY
        radius, radius, // xRadius, yRadius
        from, to, // aStartAngle, aEndAngle
        isClockwise, // aClockwise
        0 // aRotation
      );

      let points = curve.getPoints(50);
      let geometry = new THREE.BufferGeometry().setFromPoints(points);
      let material = new THREE.LineBasicMaterial({
        color: 0xff00ff,
        depthWrite: false,
        depthTest: false,
      });

      // Create the final object to add to the scene
      let ellipse = new THREE.Line(geometry, material);
      ellipse.renderOrder = 9999 + 1;
      return ellipse;
    }
    // ==angle arc
    var gizmoArc;

    this.gizmo.applyMatrix(new THREE.Matrix4().makeTranslation(0, 1, 0));
    // gizmo.matrixAutoUpdate = false;
    // scene.add(this.gizmo);

    this.plane = new THREE.Plane(new THREE.Vector3(1, 1, 0.2), 8);
    // var helper = new THREE.PlaneHelper(plane, 8, 0xffff00);
    // scene.add( helper );

    var translationPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    translationPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), this.gizmo.position);
    var translationPlaneHelper = new THREE.PlaneHelper(this.translationPlane, 10, 0xff0000);
    // scene.add(translationPlaneHelper);
    var zeroAngleDir = new THREE.Vector3(1, 0, 0);

    var pickCircle = function(pos) {
      raycaster.setFromCamera(pos, camera);

      // cancel gizmo highlighing
      for (let i = 0; i < gizmoCircles.length; i++) {
        let line = gizmoCircles[i];
        if (line.material.prevColor) {
          line.material.color.copy(line.material.prevColor);
          line.material.needsUpdate = true;
          delete line.material.prevColor;
        }
      }

      raycaster.linePrecision = 0.15;

      var intersects = raycaster.intersectObjects(gizmoCircles);
      if (intersects.length > 0) {
        let line = intersects[0].object;
        if (!line.material.prevColor) {
          line.material.prevColor = line.material.color.clone();
          line.material.color.setHex(0xffff00);
          line.material.needsUpdate = true;

          if (line === ellipseX) {
            zeroAngleDir.set(1, 0, 0);
            translationPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), this.gizmo.position);
          } else if (line === ellipseY) {
            zeroAngleDir.set(1, 0, 0);
            translationPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), this.gizmo.position);
          } else if (line === ellipseZ) {
            zeroAngleDir.set(0, 0, -1);
            translationPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(1, 0, 0), this.gizmo.position);
          }

          controls.enabled = false;
          return intersects[0].point;
        }
      } else {
        controls.enabled = true;
        return undefined;
      }
    }.bind(this)

    var getPick = function(pos) {
      raycaster.setFromCamera(pos, camera);
      let target = new THREE.Vector3();
      raycaster.ray.intersectPlane(translationPlane, target);
      return target;
    }

    var getAngle = function(v, zeroDir, normal) {
      let angle = Math.acos(zeroDir.dot(v));

      let adir = zeroDir.clone().cross(v).normalize().sub(normal);
      if (adir.lengthSq() > 1e-3) {
        angle = 2 * Math.PI - angle;
      }

      return angle;
    }

    var pickPoint0;
    var pickPoint1;

    var startAngle;
    var prevAngle;
    var endAngle;
    var totalRotation;

    var turnCount = 0;

    var mouse = new RayysMouse(renderer, camera);
    var raycaster = new THREE.Raycaster();
    mouse.subscribe(
      function(pos) {
        // console.log(`Mouse down at: ${JSON.stringify(pos)}`);

        pickPoint0 = pickCircle(pos);
        if (pickPoint0) {

          points.geometry.vertices[0].copy(pickPoint0);
          points.geometry.verticesNeedUpdate = true;

          startSeg.geometry.vertices[1].copy(pickPoint0.clone().sub(this.gizmo.position));
          startSeg.geometry.verticesNeedUpdate = true;

          let v = pickPoint0.clone().sub(this.gizmo.position).normalize();
          startAngle = getAngle(v, zeroAngleDir, translationPlane.normal);
          endAngle = startAngle;
          prevAngle = startAngle;
          totalRotation = 0.0;
          turnCount = 0;

          // console.log(startAngle);
        }
      }.bind(this),
      function(pos, event, sender) {
        // console.log(`Mouse moved to: ${JSON.stringify(pos)}`);
        if (!sender.mouseDown) {
          pickCircle(pos);
        } else if (pickPoint0 !== undefined) {
          pickPoint1 = getPick(pos);

          points.geometry.vertices[1].copy(pickPoint1);
          points.geometry.verticesNeedUpdate = true;

          startSeg.geometry.vertices[3].copy(pickPoint1.clone().sub(this.gizmo.position));
          startSeg.geometry.verticesNeedUpdate = true;

          let v = pickPoint1.clone().sub(this.gizmo.position).normalize();
          prevAngle = endAngle;
          endAngle = getAngle(v, zeroAngleDir, translationPlane.normal);

          let angleIncrement = (endAngle - prevAngle);

          if (angleIncrement < -Math.PI) {
            angleIncrement += 2 * Math.PI;
            turnCount++;
          }

          if (angleIncrement > Math.PI) {
            angleIncrement -= 2 * Math.PI;
            turnCount--;
          }

          totalRotation += angleIncrement;
          // console.log(`turnCount=${turnCount}, rotation=${totalRotation}`);

          if (gizmoArc) {
            this.gizmo.remove(gizmoArc);
          }
          if (Math.abs(totalRotation) < 2 * Math.PI) {
            gizmoArc = makeGizmoArc(startAngle, endAngle, totalRotation < 0);
          } else {
            gizmoArc = makeGizmoArc(0, 2 * Math.PI, false);
          }
          gizmoArc.lookAt(translationPlane.normal);
          this.gizmo.add(gizmoArc);

          let position = new THREE.Vector3();
          let quaternion = new THREE.Quaternion();
          let scale = new THREE.Vector3();
          this.matrix.decompose(position, quaternion, scale);

          let dquat = new THREE.Quaternion();
          dquat.setFromAxisAngle(translationPlane.normal, angleIncrement);
          quaternion.premultiply(dquat);
          this.matrix.compose(position, quaternion, scale);
        }
      }.bind(this),
      function(pos) {
        // console.log(`Mouse up at: ${JSON.stringify(pos)}`);
        if (gizmoArc) {
          this.gizmo.remove(gizmoArc);
        }
      }.bind(this),
    );

		return this.gizmo;
  }
  
  render(renderer, scene, camera) {
    var dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    this.plane.setFromNormalAndCoplanarPoint(dir, this.origin);

    var dist = this.plane.distanceToPoint(camera.position);
    var f = Math.abs(dist) / 10;

    var gposition = new THREE.Vector3();
    var gquaternion = new THREE.Quaternion();
    var gscale = new THREE.Vector3();

    this.gizmo.matrix.decompose(gposition, gquaternion, gscale);
    this.gizmo.matrix.identity();
    this.gizmo.matrix.compose(gposition, gquaternion, new THREE.Vector3(f, f, f));
  }
}
