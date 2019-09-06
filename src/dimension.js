var renderer;
var camera;

var scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 15;
camera.position.y = 15;
camera.position.z = 15;
camera.lookAt(0, 0, 0);

renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(0xfefefe));
document.body.appendChild(renderer.domElement);

var orbit = new THREE.OrbitControls(camera, renderer.domElement);

// create light
{
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 100, 50);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  scene.add(spotLight);
}

var root = new THREE.Object3D();
scene.add(root);

var geometry = new THREE.BoxGeometry(8.3, 0.5, 8.4);
var material = new THREE.MeshPhongMaterial({
  color: 0xf9f9f9,
  transparent: true,
  opacity: 0.75
});
var cube = new THREE.Mesh(geometry, material);
cube.geometry.computeBoundingBox ();
root.add(cube);

var dim0 = new RayysLinearDimension(document.body, renderer, camera);
var dim1 = new RayysLinearDimension(document.body, renderer, camera);

var facingCamera = new RayysFacingCamera ();
facingCamera.cb.facingDirChange.push(function(event) {
	let facingDir = facingCamera.dirs[event.current.best];
  if (dim0.node !== undefined) {
  	dim0.detach();
  }
  if (dim1.node !== undefined) {
  	dim1.detach();
  }

  var bbox = cube.geometry.boundingBox;
  if (Math.abs(facingDir.x) === 1) {
  	let from = new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.min.z);
    let to = new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.max.z);
    let newDimension = dim0.create(from, to, facingDir);
    cube.add(newDimension);
  }
  if (Math.abs(facingDir.z) === 1) {
  	let from = new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.min.z);
    let to = new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.max.z);
    let newDimension = dim0.create(from, to, facingDir);
    cube.add(newDimension);
  }
  if (Math.abs(facingDir.y) === 1) {
    let newArray = event.current.facing.slice();
    let bestIdx = newArray.indexOf(event.current.best);
    newArray.splice(bestIdx, 1);

		let facingDir0 = facingCamera.dirs[newArray[0]];
		let facingDir1 = facingCamera.dirs[newArray[1]];

		let from = new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.min.z);
    let to = new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.max.z);

		console.log(from, to);
    let newDimension0 = dim0.create(from, to, facingDir0);
    let newDimension1 = dim1.create(from, to, facingDir1);
    cube.add(newDimension0);
    cube.add(newDimension1);
  }
});

var animate = function() {
  requestAnimationFrame(animate);
  facingCamera.check(camera);
  dim0.update(scene, camera);
  dim1.update(scene, camera);
  renderer.render(scene, camera);
};

animate();
