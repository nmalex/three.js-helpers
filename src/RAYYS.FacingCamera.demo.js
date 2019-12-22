'use strict';

import * as THREE from 'three';
import { RayysFacingCamera } from './RAYYS.FacingCamera'

export class RayysFacingCameraDemo {
    init(demo) {
        const scene = demo.scene;
        demo.camera.position.set(2,2,2);

        // add signal cube made of 6 planes
        const size = 1;
        const geometry = new THREE.PlaneGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 0x4040a9,
            transparent: true,
            opacity: 0.5
        });
        const plane0 = new THREE.Mesh(geometry, material.clone());
        plane0.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, size / 2));
        scene.add(plane0); // dir: z=1

        const plane1 = new THREE.Mesh(geometry, material.clone());
        plane1.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, size / 2));
        plane1.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI / 2));
        scene.add(plane1); // dir: x=1;

        const plane2 = new THREE.Mesh(geometry, material.clone());
        plane2.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, size / 2));
        plane2.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI));
        scene.add(plane2); // dir: z=-1;

        const plane3 = new THREE.Mesh(geometry, material.clone());
        plane3.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, size / 2));
        plane3.applyMatrix(new THREE.Matrix4().makeRotationY(-Math.PI / 2));
        scene.add(plane3); // dir: x=-1;

        const plane4 = new THREE.Mesh(geometry, material.clone());
        plane4.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, size / 2));
        plane4.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));
        scene.add(plane4); // dir: y=-1;

        const plane5 = new THREE.Mesh(geometry, material.clone());
        plane5.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, size / 2));
        plane5.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
        scene.add(plane5); // dir: y=1;

        const planes = [
            plane1, // xplus 
            plane3, // xminus
            plane5, // yplus
            plane4, // yminus
            plane0, // zplus
            plane2 // zminus
        ];

        this.facingCamera = new RayysFacingCamera();
        this.facingCamera.cb.facingDirChange.push(function(event) {
            if (event.before.best !== undefined) {
                planes[event.before.best].material.color.setHex(0x4040a9);
            }
            planes[event.current.best].material.color.setHex(0xf02020);
        });

    }

    update(demo) {
        this.facingCamera.check(demo.camera);
    }
}
