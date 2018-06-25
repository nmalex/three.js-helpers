var renderer;
var controls;

var scene = new THREE.Scene();
var width = window.innerWidth;
var height = window.innerHeight;
var aspect = width / height;
var camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);

renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(0xfefefe));
document.body.appendChild(renderer.domElement);

camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 5;
camera.lookAt(0, 0, 0);

controls = new THREE.OrbitControls(camera);

// white spotlight shining from the side, casting a shadow
var spotLight = new THREE.SpotLight(0xffffff, 2.5, 25, Math.PI / 6);
spotLight.position.set(4, 10, 1);
scene.add(spotLight);

// grid
var size = 10;
var divisions = 10;
var gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );

var origin = new THREE.Vector3(0, 0, 0);
var radius = 2;

var gizmo = new THREE.Object3D();

var geometry = new THREE.SphereBufferGeometry( radius-1e-1, 32, 32 );
var material = new THREE.MeshBasicMaterial( {color: 0x00000, transparent: true, opacity: 0.02} );
var sphere = new THREE.Mesh( geometry, material );
sphere.layers.set(2);
gizmo.add( sphere );

var gizmoCircles = [];

// X-plane curve
var curve = new THREE.EllipseCurve(
	0,  0,            // ax, aY
	radius, radius,   // xRadius, yRadius
	0,  2 * Math.PI,  // aStartAngle, aEndAngle
	false,            // aClockwise
	0                 // aRotation
);

var points = curve.getPoints( 90 );
var geometry = new THREE.BufferGeometry().setFromPoints( points );
var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
var ellipse = new THREE.Line( geometry, material );
gizmoCircles.push(ellipse);
ellipse.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/2));
ellipse.layers.set(1);
gizmo.add(ellipse);

// Y-plane curve
var curve = new THREE.EllipseCurve(
	0,  0,            // ax, aY
	radius, radius,   // xRadius, yRadius
	0,  2 * Math.PI,  // aStartAngle, aEndAngle
	false,            // aClockwise
	0                 // aRotation
);

var points = curve.getPoints( 90 );
var geometry = new THREE.BufferGeometry().setFromPoints( points );
var material = new THREE.LineBasicMaterial( { color : 0x00ff00 } );
var ellipse = new THREE.Line( geometry, material );
gizmoCircles.push(ellipse);
ellipse.layers.set(1);
gizmo.add(ellipse);

// Z-plane curve
var curve = new THREE.EllipseCurve(
	0,  0,            // ax, aY
	radius, radius,   // xRadius, yRadius
	0,  2 * Math.PI,  // aStartAngle, aEndAngle
	false,            // aClockwise
	0                 // aRotation
);

var points = curve.getPoints( 90 );
var geometry = new THREE.BufferGeometry().setFromPoints( points );
var material = new THREE.LineBasicMaterial( { color : 0x0000ff } );
var ellipse = new THREE.Line( geometry, material );
gizmoCircles.push(ellipse);
ellipse.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI/2));
ellipse.layers.set(1);
gizmo.add(ellipse);

gizmo.applyMatrix(new THREE.Matrix4().makeTranslation(0, 1, 0));
gizmo.matrixAutoUpdate = false;
scene.add(gizmo);

var plane = new THREE.Plane(new THREE.Vector3(1, 1, 0.2), 8);
var helper = new THREE.PlaneHelper(plane, 8, 0xffff00);
scene.add( helper );

var mouse = new RayysMouse(renderer, camera);
var raycaster = new THREE.Raycaster();
mouse.subscribe(
	function(pos) {
  	console.log(`Mouse down at: ${JSON.stringify(pos)}`);
  },
  function(pos) {
    // console.log(`Mouse moved to: ${JSON.stringify(pos)}`);
    raycaster.setFromCamera( pos, camera );
    /* var intersects = raycaster.intersectObjects( [ sphere ] );
    if (intersects.length > 0) {
      sphere.material.opacity = 0.25;
      sphere.material.needsUpdate = true;
      controls.enabled = false;
    } else {
      sphere.material.opacity = 0.02;
      sphere.material.needsUpdate = true;
      controls.enabled = true;
    } */

    controls.enabled = false;

    for (let i=0; i<gizmoCircles.length; i++) {
      let line = gizmoCircles[i];
      if (line.material.prevColor) {
        line.material.color.copy(line.material.prevColor);
        line.material.needsUpdate = true;
        delete line.material.prevColor;
      }
    }

    raycaster.linePrecision = 0.1;
    var intersects = raycaster.intersectObjects( gizmoCircles );
    if (intersects.length > 0) {
      for (let i=0; i<intersects.length; i++) {
        let line = intersects[i].object;
        if (!line.material.prevColor) {
          line.material.prevColor = line.material.color.clone();
          line.material.color.setHex(0xff00ff);
          line.material.needsUpdate = true;
          return;
        }
      }
    }
    controls.enabled = true;
  },
  function(pos) {
  	console.log(`Mouse up at: ${JSON.stringify(pos)}`);
  }
);

var animate = function() {
  requestAnimationFrame(animate);
  controls.update();

  var dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  plane.setFromNormalAndCoplanarPoint(dir, origin);

  var dist = plane.distanceToPoint(camera.position);
  var f = Math.abs(dist) / 10;

  var gposition = new THREE.Vector3();
  var gquaternion = new THREE.Quaternion();
  var gscale = new THREE.Vector3();
  gizmo.matrix.decompose(gposition, gquaternion, gscale);
  gizmo.matrix.identity();
  gizmo.matrix.compose(gposition, gquaternion, new THREE.Vector3(f, f, f));

  camera.layers.set(0);
  renderer.render(scene, camera);
  renderer.autoClearColor = false;
  renderer.autoClearDepth = false;

  camera.layers.set(2);
  renderer.render(scene, camera);
  renderer.autoClearColor = false;
  renderer.autoClearDepth = false;

	camera.layers.set(1);
  renderer.render(scene, camera);
  renderer.autoClearDepth = true;
  renderer.autoClearColor = true;
};

animate();
