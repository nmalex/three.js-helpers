'use strict';

import * as THREE from 'three';
import { RayysLinearDimension } from './RAYYS.LinearDimension'

export class RayysLinearDimensionDemo {
    init(demo) {
        const  geometry = new THREE.BoxBufferGeometry( 5, 2, 7.49 );
        const  material = new THREE.MeshBasicMaterial( {color: 0x64c951} );
        const  cube = new THREE.Mesh( geometry, material );
        cube.position.y += 1;
        demo.scene.add( cube );

        const  geo = new THREE.EdgesGeometry( geometry ); // or WireframeGeometry( geometry )
        const  mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } );
        const  wireframe = new THREE.LineSegments( geo, mat );
        cube.add( wireframe );

        const body = document.body;
        const raycaster = new THREE.Raycaster();
        this.dimension0 = new RayysLinearDimension(body, demo.renderer, demo.camera, raycaster);
        this.dimension1 = new RayysLinearDimension(body, demo.renderer, demo.camera, raycaster);
        demo.scene.add(
            this.dimension0.create(new THREE.Vector3(-5/2,0,7.49/2), new THREE.Vector3(5/2,0,7.49/2), new THREE.Vector3(0,0,1.5))
        );
        demo.scene.add(
            this.dimension1.create(new THREE.Vector3(5/2,0,-7.49/2), new THREE.Vector3(5/2,0,7.49/2), new THREE.Vector3(1.5,0,0))
        );
    }
    update(demo) {
        this.dimension0.update(demo.scene, demo.camera);
        this.dimension1.update(demo.scene, demo.camera);
    }
}