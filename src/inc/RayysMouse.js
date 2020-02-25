class RayysMouse {
    /* https://github.com/nmalex/three.js-helpers */
    /* implemented by horoshiloff@gmail.com | https://www.linkedin.com/in/nmalex/ */

    constructor(renderer, camera, controls) {
        this.renderer = renderer;
        this.camera = camera;
        this.controls = controls;

        this.mouse = new THREE.Vector2();
        this.rawCoords = new THREE.Vector2();

        this.cb = {
            onMouseDown: [],
            onMouseUp: [],
            onMouseMove: [],
            onMouseWheel: [],
        };

        this.__disposed = false;

        var onMouseDown = function(event) {
            if (this.__disposed) return;
            if (this.controls) {
                this.controls.enablePan = false;
                this.controls.enableRotate = false;
            }

            this.prevMouse = this.mouse.clone();
            this.updateMouseCoords(event, this.mouse);
            this.mouseDown = this.mouse.clone();
            this.rawMouseDown = this.rawCoords.clone();

            // notify subscribers
            for (var i = 0; i < this.cb.onMouseDown.length; i++) {
                this.cb.onMouseDown[i](this.mouse, event, this);
            }
        }.bind(this);

        var onMouseUp = function(event) {
            if (this.__disposed) return;
            this.prevMouse = this.mouse.clone();
            this.updateMouseCoords(event);
            this.mouseDown = undefined;
            this.rawMouseDown = undefined;

            if (this.controls) {
                this.controls.enablePan = false;
                this.controls.enableRotate = false;
            }

            for (var i = 0; i < this.cb.onMouseUp.length; i++) {
                this.cb.onMouseUp[i](this.mouse, event, this);
            }
        }.bind(this);

        var onMouseMove = function(event) {
            if (this.__disposed) return;
            this.prevMouse = this.mouse.clone();
            this.updateMouseCoords(event);
            if (!this.prevMouse.equals(this.mouse)) {
                for (var i = 0; i < this.cb.onMouseMove.length; i++) {
                    this.cb.onMouseMove[i](this.mouse, event, this);
                }
            }
        }.bind(this);

        var onMouseWheel = function(event) {
            if (this.__disposed) return;
            for (var i = 0; i < this.cb.onMouseMove.length; i++) {
                this.cb.onMouseWheel[i](this.mouse, event, this);
            }
        }.bind(this);

        renderer.domElement.addEventListener('mousemove', onMouseMove, false);
        renderer.domElement.addEventListener('mousedown', onMouseDown, false);
        renderer.domElement.addEventListener('mouseup', onMouseUp, false);
        renderer.domElement.addEventListener('wheel', onMouseWheel, false);

        this.__onMouseMove = onMouseMove;
        this.__onMouseDown = onMouseDown;
        this.__onMouseUp = onMouseUp;
        this.__onMouseWheel = onMouseWheel;
    }

    updateMouseCoords(event) {
        if (this.__disposed) return;
        this.rawCoords.x = (event.offsetX - this.renderer.domElement.offsetLeft) - this.renderer.domElement.offsetWidth / 2;
        this.rawCoords.y = -(event.offsetY - this.renderer.domElement.offsetTop + 0.5) + this.renderer.domElement.offsetHeight / 2;
        this.mouse.x = ((event.offsetX - this.renderer.domElement.offsetLeft + 0.5) / this.renderer.domElement.offsetWidth) * 2 - 1;
        this.mouse.y = -((event.offsetY - this.renderer.domElement.offsetTop + 0.5) / this.renderer.domElement.offsetHeight) * 2 + 1;
    }

    subscribe(mouseDownHandler, mouseMoveHandler, mouseUpHandler, mouseWheelHandler) {
        if (this.__disposed) return;
        if (mouseDownHandler) {
            this.cb.onMouseDown.push(mouseDownHandler);
        }
        if (mouseMoveHandler) {
            this.cb.onMouseMove.push(mouseMoveHandler);
        }
        if (mouseUpHandler) {
            this.cb.onMouseUp.push(mouseUpHandler);
        }
        if (mouseWheelHandler) {
            this.cb.onMouseWheel.push(mouseWheelHandler);
        }
    }

    dispose() {
        this.__disposed = true;
 
        this.renderer.domElement.removeEventListener('mousemove', this.__onMouseMove);
        this.renderer.domElement.removeEventListener('mousedown', this.__onMouseDown);
        this.renderer.domElement.removeEventListener('mouseup', this.__onMouseUp);
        this.renderer.domElement.removeEventListener('wheel', this.__onMouseWheel);

        this.cb.onMouseDown.splice(0, this.cb.onMouseDown.length - 1);
        this.cb.onMouseUp.splice(0, this.cb.onMouseUp.length - 1);
        this.cb.onMouseMove.splice(0, this.cb.onMouseMove.length - 1);
        this.cb.onMouseWheel.splice(0, this.cb.onMouseWheel.length - 1);
    }
}