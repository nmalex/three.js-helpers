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
renderer.setClearColor(new THREE.Color(0x303030));
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

var gizmoCircles = [ sphere ];

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
var ellipseX = new THREE.Line( geometry, material );
gizmoCircles.push(ellipseX);
ellipseX.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/2));
ellipseX.layers.set(1);
gizmo.add(ellipseX);

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
var ellipseY = new THREE.Line( geometry, material );
gizmoCircles.push(ellipseY);
ellipseY.layers.set(1);
gizmo.add(ellipseY);

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
var ellipseZ = new THREE.Line( geometry, material );
gizmoCircles.push(ellipseZ);
ellipseZ.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI/2));
ellipseZ.layers.set(1);
gizmo.add(ellipseZ);

var geom = new THREE.Geometry();
geom.vertices.push(new THREE.Vector3(0, 0, 0));
geom.vertices.push(new THREE.Vector3(0, 1, 0));
geom.vertices.push(new THREE.Vector3(0, 0, 0));
geom.vertices.push(new THREE.Vector3(0, 1, 0));
var startSeg = new THREE.LineSegments(geom, new THREE.LineBasicMaterial({
  color: 0x000000
}));
startSeg.name = "startSeg";
gizmo.add(startSeg);

var points_geom = new THREE.Geometry();
points_geom.vertices.push(new THREE.Vector3(0,0,0));
points_geom.vertices.push(new THREE.Vector3(0,0,0));
var points = new THREE.Points( points_geom, new THREE.PointsMaterial({ color: 0x00ffff, size: 0.15 }) );
scene.add(points);

//angle arc
var makeGizmoArc = function(from, to, isClockwise) {
  let curve = new THREE.EllipseCurve(
    0,  0,            // ax, aY
    1,  1,            // xRadius, yRadius
    from,  to,        // aStartAngle, aEndAngle
    isClockwise,      // aClockwise
    0                 // aRotation
  );

  let points = curve.getPoints( 50 );
  let geometry = new THREE.BufferGeometry().setFromPoints( points );
  let material = new THREE.LineBasicMaterial( { color : 0xff00ff } );

  // Create the final object to add to the scene
  let ellipse = new THREE.Line( geometry, material );
  return ellipse;
}
// ==angle arc
var gizmoArc;

gizmo.applyMatrix(new THREE.Matrix4().makeTranslation(0, 1, 0));
// gizmo.matrixAutoUpdate = false;
scene.add(gizmo);

var plane = new THREE.Plane(new THREE.Vector3(1, 1, 0.2), 8);
// var helper = new THREE.PlaneHelper(plane, 8, 0xffff00);
// scene.add( helper );

var translationPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
translationPlane.setFromNormalAndCoplanarPoint ( new THREE.Vector3(0,1,0), gizmo.position );
var translationPlaneHelper = new THREE.PlaneHelper(this.translationPlane, 10, 0xff0000);
// scene.add(translationPlaneHelper);
var zeroAngleDir = new THREE.Vector3(1,0,0);

var pickCircle = function(pos) {
  raycaster.setFromCamera( pos, camera );

  // cancel gizmo highlighing
  for (let i=0; i<gizmoCircles.length; i++) {
    let line = gizmoCircles[i];
    if (line.material.prevColor) {
      line.material.color.copy(line.material.prevColor);
      line.material.needsUpdate = true;
      delete line.material.prevColor;
    }
  }

  raycaster.linePrecision = 0.15;

  var intersects = raycaster.intersectObjects( gizmoCircles );
  if (intersects.length > 0) {
    let line = intersects[0].object;
    if (!line.material.prevColor) {
      line.material.prevColor = line.material.color.clone();
      line.material.color.setHex(0xffff00);
      line.material.needsUpdate = true;

      if (line === ellipseX) {
        zeroAngleDir.set(1,0,0);
        translationPlane.setFromNormalAndCoplanarPoint ( new THREE.Vector3(0,1,0), gizmo.position );
      } else if (line === ellipseY) {
        zeroAngleDir.set(0,1,0);
        translationPlane.setFromNormalAndCoplanarPoint ( new THREE.Vector3(0,0,1), gizmo.position );
      } else if (line === ellipseZ) {
        zeroAngleDir.set(0,0,1);
        translationPlane.setFromNormalAndCoplanarPoint ( new THREE.Vector3(1,0,0), gizmo.position );
      }

      // let target = new THREE.Vector3();
      // raycaster.ray.intersectPlane ( translationPlane, target );

      controls.enabled = false;
      return intersects[0].point;
    }
  } else {
    controls.enabled = true;
    return undefined;
  }
}

var getPick = function(pos) {
  raycaster.setFromCamera( pos, camera );
  let target = new THREE.Vector3();
  raycaster.ray.intersectPlane ( translationPlane, target );
  return target;
}

var getAngle = function(v, zeroDir, normal) {
  let angle = Math.acos(zeroDir.dot(v));

  let adir = zeroDir.clone().cross(v).normalize().sub(normal);
  if (adir.lengthSq() > 1e-3) {
    angle = 2 * Math.PI - angle;
  }

  return angle;
}

var pickPoint0;
var pickPoint1;

var startAngle;
var prevAngle;
var endAngle;
var totalRotation;

var mouse = new RayysMouse(renderer, camera);
var raycaster = new THREE.Raycaster();
mouse.subscribe(
	function(pos) {
    console.log(`Mouse down at: ${JSON.stringify(pos)}`);

    pickPoint0 = pickCircle(pos);
    if (pickPoint0) {

      points.geometry.vertices[0].copy(pickPoint0);
      points.geometry.verticesNeedUpdate = true;

      startSeg.geometry.vertices[1].copy(pickPoint0.clone().sub(gizmo.position));
      startSeg.geometry.verticesNeedUpdate = true;

      let v2 = pickPoint0.clone().sub(gizmo.position).normalize();
      startAngle = getAngle(v2, zeroAngleDir, translationPlane.normal);
      endAngle = startAngle;
      prevAngle = startAngle;
      totalRotation = 0.0;

      console.log(startAngle);
    }
  },
  function(pos, sender) {
    // console.log(`Mouse moved to: ${JSON.stringify(pos)}`);
    if (!sender.mouseDown) {
      pickCircle(pos);
    } else if (pickPoint0 !== undefined) {
      pickPoint1 = getPick(pos);

      points.geometry.vertices[1].copy(pickPoint1);
      points.geometry.verticesNeedUpdate = true;

      startSeg.geometry.vertices[3].copy(pickPoint1.clone().sub(gizmo.position));
      startSeg.geometry.verticesNeedUpdate = true;

      let v2 = pickPoint1.clone().sub(gizmo.position).normalize();
      prevAngle = endAngle;
      endAngle = getAngle(v2, zeroAngleDir, translationPlane.normal);
      let da = (endAngle - prevAngle);
      totalRotation += da;
      console.log(`prevAngle=${prevAngle}, endAngle=${endAngle}, da=${da}, totalRotation=${totalRotation}`);

      if (gizmoArc) {
        gizmo.remove(gizmoArc);
      }
      gizmoArc = makeGizmoArc(startAngle, endAngle, totalRotation < 0);
      gizmoArc.lookAt(translationPlane.normal);
      gizmo.add(gizmoArc);

      // console.log(startAngle, " => ", endAngle);
    }
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
