// snap target may be of 1 of 3 types:
// 1. Vector3 - point in world space
// 2. Line - line in world space
// 3. Plane - plane in world space
class SnapTarget {
    constructor() {
        this.points = [];
        this.lines = [];
        this.planes = [];
    }

    // try to snap this targets to given snap target, using given snap actor
    // and if it snaps - return Vector3 of the desired snap object offset AND snapped point, line or plane
    snap(previewOffset, other, actor) {
        let zeroSnap = new THREE.Vector3();

        if (actor.canSnapPoints) {
            for (let i=0; i<this.points.length; i++) {
                let point = this.points[i];
                let previewPos = point.clone().add(previewOffset);

                for (let j=0; j<other.points.length; j++) {
                    let targetPos = other.points[j];
                    let snapOffs = actor.snap( null, previewPos, targetPos );
                    if (snapOffs && !RayysMiscHelpers.vectorsEqual(zeroSnap, snapOffs, 1e-6)) {
                        // console.log(`Snap points ${JSON.stringify(previewPos)} to ${JSON.stringify(snapOffs)}`);
                        return snapOffs;
                    }
                }
            }
        }
        if (actor.canSnapLines) {
            for (let i=0; i<this.lines.length; i++) {
                let line = this.lines[i];
                let previewLine = line.clone().applyMatrix4( RayysMiscHelpers.makeTranslationFromVector(previewOffset) );

                for (let j=0; j<other.lines.length; j++) {
                    let targetLine = other.lines[j];
                    let snapOffs = actor.snap( null, previewLine, targetLine );
                    if (snapOffs && !RayysMiscHelpers.vectorsEqual(zeroSnap, snapOffs, 1e-6)) {
                        // console.log(`Snap lines ${JSON.stringify(previewLine)} to ${JSON.stringify(snapOffs)}`);
                        return snapOffs;
                    }
                }
            }
        }
        if (actor.canSnapPlanes) {
            for (let i=0; i<this.planes.length; i++) {
                let plane = this.planes[i];
                let previewPlane = plane.clone().applyMatrix4( RayysMiscHelpers.makeTranslationFromVector(previewOffset) );

                for (let j=0; j<other.planes.length; j++) {
                    let targetPlane = other.planes[j];
                    let snapOffs = actor.snap( null, previewPlane, targetPlane );
                    if (snapOffs && !RayysMiscHelpers.vectorsEqual(zeroSnap, snapOffs, 1e-6)) {
                        // console.log(`Snap planes ${JSON.stringify(previewPlane)} to ${JSON.stringify(snapOffs)}`);
                        return snapOffs;
                    }
                }
            }

        }
    }

    getNode(addPoints, addLines, addPlanes) {
        let node = new THREE.Object3D();

        if (addPoints === undefined || addPoints) {
            //This will add a starfield to the background of a scene
            let pointsGeometry = new THREE.Geometry();
            for (let i = 0; i < this.points.length; i ++ ) {
                pointsGeometry.vertices.push( this.points[i].clone() );
            }

            let material = new THREE.PointsMaterial( { color: 0x888888, size: 0.1 } );
            let pointsObj = new THREE.Points( pointsGeometry, material );
            node.add( pointsObj );
        }

        if (addLines === undefined || addLines) {
            let material = new THREE.LineBasicMaterial({
                color: 0x0000ff
            });
            
            let linesGeometry = new THREE.Geometry();
            for (let i = 0; i < this.lines.length; i ++ ) {
                let line = this.lines[i];
                let dir = line.end.clone().sub(line.start).normalize();
                linesGeometry.vertices.push(
                    line.start.clone().sub(dir),
                    line.end.clone().add(dir)
                );
            }
            
            let line = new THREE.LineSegments( linesGeometry, material );
            node.add( line );
        }

        if (addPlanes === undefined || addPlanes) {

            for (let i = 0; i < this.planes.length; i ++ ) {
                let plane = this.planes[i];
                let helper = new THREE.PlaneHelper( plane, 1, 0xffff00 );
                node.add( helper );
            }
        }

        return node;
    }
}
