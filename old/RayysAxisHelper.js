class RayysAxisHelper {
  create(bias, n) {
    if (n === undefined) n = 2;
    if (n < 1) n = 2;

    var node = new THREE.Object3D();

    var biasArr = [
      [0, bias, 0],
      [0, -bias, 0],
      [bias, 0, 0],
      [-bias, 0, 0],
      [0, 0, bias],
      [0, 0, -bias],

      [0, bias, bias],
      [0, -bias, bias],
      [bias, 0, bias],
      [-bias, 0, bias],
      [0, bias, bias],
      [0, bias, -bias],

      [0, bias, -bias],
      [0, -bias, -bias],
      [bias, 0, -bias],
      [-bias, 0, -bias],
      [0, -bias, bias],
      [0, -bias, -bias],
    ];

    var geometryX = new THREE.Geometry();
    var geometryY = new THREE.Geometry();
    var geometryZ = new THREE.Geometry();

    var step = 1 / n;

    for (var k = 0; k < biasArr.length; k++) {
      // axis X
      for (var xi = 0; xi < 1; xi += step) {
        for (var xj = 0; xj < 1; xj += step) {
          geometryX.vertices.push(new THREE.Vector3(0, 0 + xi * biasArr[k][1], 0 + xj * biasArr[k][2]));
          geometryX.vertices.push(new THREE.Vector3(1, 0 + xi * biasArr[k][1], 0 + xj * biasArr[k][2]));
        }
      }

      // axis Y
      for (var yi = 0; yi < 1; yi += step) {
        for (var yj = 0; yj < 1; yj += step) {
          geometryY.vertices.push(new THREE.Vector3(0 + yi * biasArr[k][0], 0, 0 + yj * biasArr[k][2]));
          geometryY.vertices.push(new THREE.Vector3(0 + yi * biasArr[k][0], 1, 0 + yj * biasArr[k][2]));
        }
      }

      // axis Z
      for (var zi = 0; zi < 1; zi += step) {
        for (var zj = 0; zj < 1; zj += step) {
          geometryZ.vertices.push(new THREE.Vector3(0 + zi * biasArr[k][1], 0 + zj * biasArr[k][2], 0));
          geometryZ.vertices.push(new THREE.Vector3(0 + zi * biasArr[k][1], 0 + zj * biasArr[k][2], 1));
        }
      }
    }

    var lineX = new THREE.LineSegments(geometryX, new THREE.LineBasicMaterial({
      color: 0xff0000
    }));
    lineX.name = "lineX";
    node.add(lineX);

    var lineY = new THREE.LineSegments(geometryY, new THREE.LineBasicMaterial({
      color: 0x00ff00
    }));
    lineX.name = "lineY";
    node.add(lineY);

    var lineZ = new THREE.LineSegments(geometryZ, new THREE.LineBasicMaterial({
      color: 0x0000ff
    }));
    lineX.name = "lineZ";
    node.add(lineZ);

    return node;
  }
}
