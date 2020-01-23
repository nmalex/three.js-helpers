class RayysMouse {
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

        var onMouseDown = function(event) {
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
            this.prevMouse = this.mouse.clone();
            this.updateMouseCoords(event);
            if (!this.prevMouse.equals(this.mouse)) {
                for (var i = 0; i < this.cb.onMouseMove.length; i++) {
                    this.cb.onMouseMove[i](this.mouse, event, this);
                }
            }
        }.bind(this);

        var onMouseWheel = function(event) {
            for (var i = 0; i < this.cb.onMouseMove.length; i++) {
                this.cb.onMouseWheel[i](this.mouse, event, this);
            }
        }.bind(this);

        renderer.domElement.addEventListener('mousemove', onMouseMove, false);
        renderer.domElement.addEventListener('mousedown', onMouseDown, false);
        renderer.domElement.addEventListener('mouseup', onMouseUp, false);
        renderer.domElement.addEventListener('wheel', onMouseWheel, false);
    }

    updateMouseCoords(event) {
        this.rawCoords.x = (event.offsetX - this.renderer.domElement.offsetLeft) - this.renderer.domElement.offsetWidth / 2;
        this.rawCoords.y = -(event.offsetY - this.renderer.domElement.offsetTop + 0.5) + this.renderer.domElement.offsetHeight / 2;
        this.mouse.x = ((event.offsetX - this.renderer.domElement.offsetLeft + 0.5) / this.renderer.domElement.offsetWidth) * 2 - 1;
        this.mouse.y = -((event.offsetY - this.renderer.domElement.offsetTop + 0.5) / this.renderer.domElement.offsetHeight) * 2 + 1;
    }

    subscribe(mouseDownHandler, mouseMoveHandler, mouseUpHandler, mouseWheelHandler) {
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
}