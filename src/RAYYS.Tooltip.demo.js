'use strict';

import * as THREE from 'three';
import { RayysWebColors } from './RAYYS.WebColors'
import { RayysTooltip } from './RAYYS.Tooltip'

export class RayysTooltipDemo {
    init({
        scene,
        camera,
        renderer,
        controls,
    }) {
        // white spotlight shining from the side, casting a shadow
        var spotLight = new THREE.SpotLight(0xffffff, 2.5, 25, Math.PI / 6);
        spotLight.position.set(6, 15, 9.5);
        scene.add(spotLight);

        // collect objects for raycasting, 
        // for better performance don't raytrace all scene
        var tooltipEnabledObjects = [];

        var colors = new RayysWebColors();
        var dodecahedronGeometry = new THREE.DodecahedronBufferGeometry(6, 0);
        var dodecahedronMaterial = new THREE.MeshPhongMaterial({
            color: colors.getRandom(),
            transparent: true,
            opacity: 0.95
        });
        var dodecahedron = new THREE.Mesh(dodecahedronGeometry, dodecahedronMaterial);
        scene.add(dodecahedron);

        const  geo = new THREE.EdgesGeometry( dodecahedronGeometry );
        const  mat = new THREE.LineBasicMaterial( { color: 0x000000 } );
        const  wireframe = new THREE.LineSegments( geo, mat );
        dodecahedron.add( wireframe );

        var size = 0.25;
        var vertGeometry = new THREE.BoxGeometry(size, size, size);
        var vertMaterial = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            transparent: false
        });

        var verts = dodecahedronGeometry.attributes.position.array;
        for (let k = 0; k < verts.length; k += 3) {
            var vertMarker = new THREE.Mesh(vertGeometry, vertMaterial);
            
            // this is how tooltip text is defined for each box
            let tooltipText = `idx: ${k}, pos: [${verts[k].toFixed(3)},${verts[k+1].toFixed(3)},${verts[k+2].toFixed(3)}]`;
            vertMarker.userData.tooltipText = tooltipText;
            
            vertMarker.applyMatrix(new THREE.Matrix4().makeTranslation(verts[k], verts[k + 1], verts[k + 2]));
            scene.add(vertMarker);
            tooltipEnabledObjects.push(vertMarker);
        }

        const tooltip = new RayysTooltip(renderer, camera);
        tooltip.setObjects(tooltipEnabledObjects);
    }
}
