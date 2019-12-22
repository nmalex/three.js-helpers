'use strict';

import * as THREE from 'three';
import { RayysMouse } from './RAYYS.Mouse'

export class RayysMouseDemo {
    init(demo) {
        this.mouse = new RayysMouse(demo.renderer, demo.camera, demo.controls);

        this.output = document.createElement("div");
        this.output.id = 'output'
        this.output.className = 'output'
        this.output.innerHTML = '';
        document.body.appendChild(this.output);

        this.mouse.subscribe(this.mouseDownHandler.bind(this), this.mouseMoveHandler.bind(this), this.mouseUpHandler.bind(this));

        this.mouseButtonPressed = null;
    }

    mouseDownHandler(mouse, event, sender) {
        this.mouseButtonPressed = event.button;
        this.output.innerText = 'Mouse button pressed: ' + this.mouseButtonPressed + ', ' 
                                    + 'Mouse coords: { x: ' + mouse.x.toFixed(3) + ', y: ' + mouse.y.toFixed(3) + '}';
    }

    mouseMoveHandler(mouse, event, sender) {
        this.output.innerText = JSON.stringify(mouse);
        this.output.innerText = (this.mouseButtonPressed !== null ? 'Mouse button pressed: ' + this.mouseButtonPressed + ', ' : '') 
                                    + 'Mouse coords: { x: ' + mouse.x.toFixed(3) + ', y: ' + mouse.y.toFixed(3) + '}';
    }

    mouseUpHandler(mouse, event, sender) {
        this.mouseButtonPressed = null;
        this.output.innerText = JSON.stringify(mouse);
        this.output.innerText = 'Mouse coords: { x: ' + mouse.x.toFixed(3) + ', y: ' + mouse.y.toFixed(3) + '}';
    }
}
