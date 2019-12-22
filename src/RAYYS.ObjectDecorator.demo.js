'use strict';

import * as THREE from 'three';
import { RayysWebColors } from './RAYYS.WebColors'
import { RayysBox3Helper } from './RAYYS.Box3Helper'
import { RayysMouse } from './RAYYS.Mouse'
import { RayysMouseMove } from './RAYYS.MouseMove'
import { RayysObjectDecorator } from './RAYYS.ObjectDecorator'

export class RayysObjectDecoratorDemo {
    init({
        scene,
        camera,
        renderer,
        controls
    }) {

        const mouse = new RayysMouse(renderer, camera);
        mouse.cb.onMouseDown.push(function(pos, sender) {
            // check if noting under the mouse, then deselect all

        });

        const mouseMove = new RayysMouseMove(mouse, controls);
        // scene.add(mouseMove.translationPlaneHelper);

        // white spotlight shining from the side, casting a shadow
        const spotLight = new THREE.SpotLight(0xffffff, 2.5, 25, Math.PI / 6);
        spotLight.position.set(4, 10, 7);
        scene.add(spotLight);

        const colors = new RayysWebColors();
        for (let k = 0; k < 10; k++) {
            const size = 0.35;
            const geometry = new THREE.BoxGeometry(2 * size, 2 * size, 2 * size);
            const material = new THREE.MeshPhongMaterial({
                color: colors.getRandom(),
                transparent: true,
                opacity: 0.75
            });
            const cube = new THREE.Mesh(geometry, material);
            cube.applyMatrix(new THREE.Matrix4().makeTranslation(-5 + 10 * Math.random(), 0, -5 + 10 * Math.random()));
            scene.add(cube);
            mouseMove.objects.push(cube);
        }

        const bboxFactory = new RayysBox3Helper();
        const decorator = new RayysObjectDecorator();
        decorator.decorators.material = function(object) {
            return new THREE.MeshBasicMaterial({
                color: 0xff0000,
                transparent: true,
                opacity: 0.85
            });
        };
        decorator.decorators.children = function(object) {
            object.geometry.computeBoundingBox();
            return [
                bboxFactory.create(object.geometry.boundingBox)
            ]
        };

        mouseMove.cb.onObjectEnter.push(function(obj) {
            decorator.reset();
            decorator.decorate(obj);
        });
        mouseMove.cb.onObjectLeave.push(function(obj) {
            decorator.reset();
        });

        //mouseMove.cb.onBeforeStart.push(function(obj) {
        //	decorator.reset();
        //	decorator.decorate(obj);
        //});
        mouseMove.cb.onVoidClick.push(function() {
            decorator.reset();
        });


    }
}
