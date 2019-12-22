'use strict';

import * as THREE from 'three';
import { RayysRotationGizmo } from './RAYYS.RotationGizmo'

export class RayysRotationGizmoDemo {
    init({
        scene,
        camera,
        renderer,
        controls
    }) {

        // white spotlight shining from the side, casting a shadow
        var spotLight = new THREE.SpotLight(0xffffff, 2.5, 25, Math.PI / 6);
        spotLight.position.set(4, 10, 1);
        scene.add(spotLight);

        // grid
        var size = 10;
        var divisions = 10;
        var gridHelper = new THREE.GridHelper(size, divisions);
        scene.add(gridHelper);
 
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshPhongMaterial({
          color: 0x00ff00
        });
        this.cube = new THREE.Mesh(geometry, material);
        this.cube.applyMatrix(new THREE.Matrix4().makeTranslation(0, 1, 0));
        // this.cube.matrixAutoUpdate = false;
        scene.add(this.cube);

        this.gizmo = new RayysRotationGizmo();
        scene.add(this.gizmo.init(renderer, camera, controls));
    }
    update() {
        this.cube.setRotationFromMatrix(this.gizmo.matrix)
    }
}
