class RayysMouse {
  constructor(renderer, camera, controls) {
    this.renderer = renderer;
    this.camera = camera;
    this.controls = controls;

    this.mouse = new THREE.Vector2();
    this.rawCoords = new THREE.Vector2();

    this.cb = {}
    this.cb.onMouseDown = [];
    this.cb.onMouseUp = [];
    this.cb.onMouseMove = [];

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
      for (var i=0; i<this.cb.onMouseDown.length; i++) {
      	this.cb.onMouseDown[i](this.mouse, this);
      }
    };

    var onMouseUp = function(event) {
      this.prevMouse = this.mouse.clone();
      this.updateMouseCoords(event);
      this.mouseDown = undefined;
      this.rawMouseDown = undefined;

      if (this.controls) {
        this.controls.enablePan = false;
        this.controls.enableRotate = false;
      }
      
      for (var i=0; i<this.cb.onMouseUp.length; i++) {
      	this.cb.onMouseUp[i](this.mouse, this);
      }
    };

    var onMouseMove = function(event) {
      this.prevMouse = this.mouse.clone();
      this.updateMouseCoords(event);
      if (!this.prevMouse.equals(this.mouse)) {
        for (var i=0; i<this.cb.onMouseMove.length; i++) {
          this.cb.onMouseMove[i](this.mouse, this);
        }
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove.bind(this), false);
    renderer.domElement.addEventListener('mousedown', onMouseDown.bind(this), false);
    renderer.domElement.addEventListener('mouseup',   onMouseUp.bind(this),   false);
  }

  updateMouseCoords(event) {
    this.rawCoords.x =  (event.clientX - this.renderer.domElement.offsetLeft)      - this.renderer.domElement.offsetWidth/2;
    this.rawCoords.y = -(event.clientY - this.renderer.domElement.offsetTop + 0.5) + this.renderer.domElement.offsetHeight/2;
    this.mouse.x =  ((event.clientX - this.renderer.domElement.offsetLeft + 0.5) / this.renderer.domElement.offsetWidth)  * 2 - 1;
    this.mouse.y = -((event.clientY - this.renderer.domElement.offsetTop + 0.5)  / this.renderer.domElement.offsetHeight) * 2 + 1;
  }
  
  subscribe(mouseDownHandler, mouseMoveHandler, mouseUpHandler) {
    this.cb.onMouseDown.push(mouseDownHandler);
    this.cb.onMouseMove.push(mouseMoveHandler);
    this.cb.onMouseUp.push(mouseUpHandler);
  }

}
