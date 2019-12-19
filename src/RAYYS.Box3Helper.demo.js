'use strict';

import * as THREE from 'three';
import { RayysBox3Helper } from './RAYYS.Box3Helper'

export class RayysBox3HelperDemo {
    init(demo) {
        const  geometry = new THREE.BoxBufferGeometry( 5, 2, 7.49 );
        const  material = new THREE.MeshBasicMaterial( {color: 0x64c951} );
        const  cube = new THREE.Mesh( geometry, material );
        demo.scene.add( cube );

        const  geo = new THREE.WireframeGeometry( geometry );
        const  mat = new THREE.LineBasicMaterial( { color: 0x10af10, linewidth: 2 } );
        const  wireframe = new THREE.LineSegments( geo, mat );
        cube.add( wireframe );

        geometry.computeBoundingBox();

        const helper = new RayysBox3Helper();
        const node = helper.create(geometry.boundingBox, new THREE.Color(1,0,0));
        cube.add(node);
    }
}
