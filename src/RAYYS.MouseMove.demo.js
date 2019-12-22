'use strict';

import * as THREE from 'three';
import { RayysMouse } from './RAYYS.Mouse'
import { RayysMouseMove } from './RAYYS.MouseMove'

export class RayysMouseMoveDemo {
    init(demo) {
        var size = 10;
        var divisions = 10;
        var gridHelper = new THREE.GridHelper(size, divisions);
        demo.scene.add(gridHelper);

        const movableObjects = [];
        for (let i=0; i<9; i++) {
            const  geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );
            const  material = new THREE.MeshBasicMaterial( {color: 0x64c951} );
            const  cube = new THREE.Mesh( geometry, material );
            cube.position.x = -2 + 2.1 * Math.floor(i / 3);
            cube.position.z = -2 + 2.1 * (i % 3);
            cube.position.y = 1;
            demo.scene.add(cube);
            const  geo = new THREE.WireframeGeometry( geometry );
            const  mat = new THREE.LineBasicMaterial( { color: 0x10af10 } );
            const  wireframe = new THREE.LineSegments( geo, mat );
            cube.add( wireframe );
            movableObjects.push(cube)
        }

        this.mouse = new RayysMouse(demo.renderer, demo.camera, demo.controls);
        this.mouseMove = new RayysMouseMove(this.mouse, demo.controls);

        this.mouseMove.objects = movableObjects;
    }
}
