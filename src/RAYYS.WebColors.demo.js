'use strict';

import * as THREE from 'three';
import { RayysWebColors } from './RAYYS.WebColors'

export class RayysWebColorsDemo {
    init(demo) {
        this.rayysWebColors = new RayysWebColors();
        this.colors = this.rayysWebColors.getColors();

        const BOX_SIZE = 0.1;
        let geometry = new THREE.BoxBufferGeometry( BOX_SIZE, BOX_SIZE, BOX_SIZE );

        let i = 0;
        const N = 14;
        const SPACING = 0.025;

        this.colors.forEach( color => {
            var material = new THREE.MeshBasicMaterial( { color: color.hex } );
            var cube = new THREE.Mesh( geometry, material );

            const positionX = Math.floor(i / N);
            const positionZ = i % N;

            cube.position.x = -0.6 + positionX * (BOX_SIZE + SPACING);
            cube.position.z = -1 + positionZ * (BOX_SIZE + SPACING);

            demo.scene.add(cube);
            i += 1;
        });

        demo.camera.position.set(0.1,2,0);
    }
}