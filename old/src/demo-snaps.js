
var scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 5;
camera.lookAt(0, 0, 0);

var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(0x303030));
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera);

var mouse = new RayysMouse(renderer, camera);
mouse.cb.onMouseDown.push(function(pos, sender) {
	// check if noting under the mouse, then deselect all
  
});

var mouseMove = new RayysMouseMove(mouse, controls);
// scene.add(mouseMove.translationPlaneHelper);

// white spotlight shining from the side, casting a shadow
var spotLight = new THREE.SpotLight(0xffffff, 2.5, 25, Math.PI / 6);
spotLight.position.set(4, 10, 7);
scene.add(spotLight);

var snaps = new RayysSnap(0.5);

var colors = new RayysWebColors();
for (let k=0; k<3; k++) {
  var size = 0.35;
  var geometry = new THREE.BoxGeometry(2*size, size, 3*size);
  var material = new THREE.MeshPhongMaterial({
    color: colors.pickRandom().hex,
    transparent: true,
    opacity: 0.75
  });
  var cube = new THREE.Mesh(geometry, material);
  cube.applyMatrix(new THREE.Matrix4().makeTranslation(-2 + 4*Math.random(), 0, -2 + 4*Math.random()));
  scene.add(cube);
  mouseMove.objects.push(cube);
  var targetsObj = snaps.add(cube);
  scene.add(targetsObj);
}

var bboxFactory = new RayysBBoxGeometry();
var decorator = new RayysObjectDecorator();
decorator.decorators.material = function(object) {
  return new THREE.MeshBasicMaterial({color: 0xff0000});
};
decorator.decorators.children = function(object) {
	object.geometry.computeBoundingBox();
	return [
  	bboxFactory.create(object.geometry.boundingBox)
  ]
};

mouseMove.cb.onBeforeStart.push(function(obj) {
	decorator.reset();
	decorator.decorate(obj);
});
mouseMove.cb.onVoidClick.push(function() {
	decorator.reset();
});
mouseMove.cb.onPreviewObjectMove.push(function(obj, pos, sender) {
  let res = snaps.snap(obj, pos);
  return res;
});
mouseMove.cb.onObjectMove.push(function(obj, pos, sender) {
  let oldTargetsNode = snaps.getTargetsNode(obj);
  let newTargetsNode = snaps.update(obj);
  scene.remove(oldTargetsNode);
  scene.add(newTargetsNode);
});

document.toggle = function(mode) {
  mouseMove.toggle(mode);
  $(".mode").removeClass("active");
  $(`#move-${mode}`).addClass("active");
}

var animate = function() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

animate();
