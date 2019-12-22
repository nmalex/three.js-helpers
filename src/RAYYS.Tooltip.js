'use strict';

import { RayysMouse } from './RAYYS.Mouse'
import { RayysMouseMove } from './RAYYS.MouseMove'

export class RayysTooltip {

    constructor(renderer, camera) {
        this.renderer = renderer;
        this.camera = camera;

        this.domElement = document.createElement('div');
        this.domElement.className = 'tooltip'

        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }
        insertAfter(this.domElement, this.renderer.domElement);

        this.mouse = new RayysMouse(renderer, camera);
        this.mouseMove = new RayysMouseMove(this.mouse);

        this.latestMouseProjection = null; // this is the latest projection of the mouse on object (i.e. intersection with ray)
        this.hoveredObj = null; // this objects is hovered at the moment

        // tooltip will not appear immediately. If object was hovered shortly,
        // - the timer will be canceled and tooltip will not appear at all.
        this.tooltipDisplayTimeout = null;

        this.mouseMove.objects = [];
        this.mouseMove.translationLimits.set(0, 0, 0);

        this.mouseMove.cb.onObjectEnter.push(function(obj) {
            this.latestMouseProjection = this.mouse.mouse.clone();
            this.hoveredObj = obj;
            this.handleManipulationUpdate();
        }.bind(this))

        this.mouseMove.cb.onObjectHover.push(function(obj) {
            this.latestMouseProjection = this.mouse.mouse.clone();
            this.hoveredObj = obj;
            this.handleManipulationUpdate();
        }.bind(this))

        this.mouseMove.cb.onObjectLeave.push(function() {
            this.latestMouseProjection = null;
            this.hoveredObj = null;
            this.handleManipulationUpdate();
        }.bind(this))
    }

    setObjects(tooltipEnabledObjects) {
        this.mouseMove.objects = tooltipEnabledObjects;
    }

    // This will move tooltip to the current mouse position and show it by timer.
    showTooltip() {
        if (this.domElement && this.latestMouseProjection) {
            this.domElement.style.display = 'block';
            this.domElement.style.opacity = '0';

            const canvasHalfWidth = this.renderer.domElement.offsetWidth / 2;
            const canvasHalfHeight = this.renderer.domElement.offsetHeight / 2;

            const tooltipPosition = this.latestMouseProjection.clone() // .project(camera);
            tooltipPosition.x = (tooltipPosition.x * canvasHalfWidth) + canvasHalfWidth + this.renderer.domElement.offsetLeft;
            tooltipPosition.y = -(tooltipPosition.y * canvasHalfHeight) + canvasHalfHeight + this.renderer.domElement.offsetTop;

            this.domElement.innerText = this.hoveredObj.userData.tooltipText;

            setTimeout(function() {
                const tootipWidth = this.domElement.offsetWidth;
                const tootipHeight = this.domElement.offsetHeight;

                this.domElement.style.left = `${tooltipPosition.x - tootipWidth/2}px`;
                this.domElement.style.top = `${tooltipPosition.y - tootipHeight - 9}px`;

                setTimeout(function() {
                    this.domElement.style.opacity = '1';
                }.bind(this), 25);

            }.bind(this), 25)
        }
    }

    // This will immediately hide tooltip.
    hideTooltip() {
        if (this.domElement) {
            this.domElement.style.opacity = '0';
        }
    }

    handleManipulationUpdate() {
        if (this.tooltipDisplayTimeout || !this.latestMouseProjection) {
            clearTimeout(this.tooltipDisplayTimeout);
            this.tooltipDisplayTimeout = null;
            this.hideTooltip();
        }

        if (!this.tooltipDisplayTimeout && this.latestMouseProjection) {
            this.tooltipDisplayTimeout = setTimeout(function() {
                this.tooltipDisplayTimeout = null;
                this.showTooltip();
            }.bind(this), 330);
        }
    }
}