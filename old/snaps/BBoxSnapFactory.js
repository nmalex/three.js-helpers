// SnapMaker will create a snap target from given object. Different factories 
// may return very specific collections of snap targets.
class BBoxSnapFactory {
    constructor() {
    }

    // creates snap target for given scene object
    create(obj, snapToPivot, snapToPoints, snapToLines, snapToPlanes, snapToMidlines, snapToMidplanes) {
        var snapTarget = new SnapTarget();
        this.update(obj, snapTarget, snapToPivot, snapToPoints, snapToLines, snapToPlanes, snapToMidlines, snapToMidplanes);
        return snapTarget;
    }

    update(obj, snapTargetRef, snapToPivot, snapToPoints, snapToLines, snapToPlanes, snapToMidlines, snapToMidplanes) {
        if (!obj.geometry.boundingBox) {
            obj.geometry.computeBoundingBox();
        }
        var bbox = obj.geometry.boundingBox.clone();
        bbox.applyMatrix4(obj.matrix);

        snapTargetRef.points.length = 0;
        snapTargetRef.lines.length = 0;
        snapTargetRef.planes.length = 0;

        var points = snapTargetRef.points;
        if (snapToPivot) {
            points.push(obj.position.clone());
        }

        if (snapToPoints) {
            points.push(new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.min.z));
            points.push(new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.max.z));

            points.push(new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.min.z));
            points.push(new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.max.z));

            points.push(new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.min.z));
            points.push(new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.max.z));

            points.push(new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.min.z));
            points.push(new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.max.z));
        }

        var lines = snapTargetRef.lines;
        if (snapToLines) {
            // x-axis oriented lines
            lines.push(new THREE.Line3(new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.min.z), new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.min.z)));
            lines.push(new THREE.Line3(new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.max.z), new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.max.z)));
            lines.push(new THREE.Line3(new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.min.z), new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.min.z)));
            lines.push(new THREE.Line3(new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.max.z), new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.max.z)));

            // y-axis oriented lines
            lines.push(new THREE.Line3(new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.min.z), new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.min.z)));
            lines.push(new THREE.Line3(new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.max.z), new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.max.z)));
            lines.push(new THREE.Line3(new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.min.z), new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.min.z)));
            lines.push(new THREE.Line3(new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.max.z), new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.max.z)));

            // z-axis oriented lines
            lines.push(new THREE.Line3(new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.min.z), new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.max.z)));
            lines.push(new THREE.Line3(new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.min.z), new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.max.z)));
            lines.push(new THREE.Line3(new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.min.z), new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.max.z)));
            lines.push(new THREE.Line3(new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.min.z), new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.max.z)));
        }

        var planes = snapTargetRef.planes;
        if (snapToPlanes) {
            var planeXZPositive = new THREE.Plane();
            planeXZPositive.setFromNormalAndCoplanarPoint ( new THREE.Vector3(0,1,0), bbox.max );
            planes.push(planeXZPositive);

            var planeXZNegative = new THREE.Plane();
            planeXZNegative.setFromNormalAndCoplanarPoint ( new THREE.Vector3(0,-1,0), bbox.min );
            planes.push(planeXZNegative);

            var planeXYPositive = new THREE.Plane();
            planeXYPositive.setFromNormalAndCoplanarPoint ( new THREE.Vector3(0,0,1), bbox.max );
            planes.push(planeXYPositive);

            var planeXYNegative = new THREE.Plane();
            planeXYNegative.setFromNormalAndCoplanarPoint ( new THREE.Vector3(0,0,-1), bbox.min );
            planes.push(planeXYNegative);

            var planeYZPositive = new THREE.Plane();
            planeYZPositive.setFromNormalAndCoplanarPoint ( new THREE.Vector3(1,0,0), bbox.max );
            planes.push(planeYZPositive);

            var planeYZNegative = new THREE.Plane();
            planeYZNegative.setFromNormalAndCoplanarPoint ( new THREE.Vector3(-1,0,0), bbox.min );
            planes.push(planeYZNegative);
        }

        var getMidline = function(p0, p1) {
            return (p0.clone()).add(p1).divideScalar ( 2.0 );
        };
        if (snapToMidlines) {
            // x-axis oriented midline points
            points.push(getMidline(new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.min.z), new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.min.z)));
            points.push(getMidline(new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.max.z), new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.max.z)));
            points.push(getMidline(new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.min.z), new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.min.z)));
            points.push(getMidline(new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.max.z), new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.max.z)));

            // y-axis oriented midline points
            points.push(getMidline(new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.min.z), new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.min.z)));
            points.push(getMidline(new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.max.z), new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.max.z)));
            points.push(getMidline(new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.min.z), new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.min.z)));
            points.push(getMidline(new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.max.z), new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.max.z)));

            // z-axis oriented midline points
            points.push(getMidline(new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.min.z), new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.max.z)));
            points.push(getMidline(new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.min.z), new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.max.z)));
            points.push(getMidline(new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.min.z), new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.max.z)));
            points.push(getMidline(new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.min.z), new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.max.z)));
        }

        var getMidplane = function(p0, p1, p2, p3) {
            return (p0.clone()).add(p1).add(p2).add(p3).divideScalar ( 4.0 );
        }
        if (snapToMidplanes) {
            // x is fixed
            points.push(getMidplane(
                new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.min.z), 
                new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.max.z), 
                new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.min.z), 
                new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.max.z), 
            ));
            points.push(getMidplane(
                new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.min.z), 
                new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.max.z), 
                new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.min.z), 
                new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.max.z), 
            ));

            // y is fixed
            points.push(getMidplane(
                new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.min.z), 
                new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.max.z), 
                new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.min.z), 
                new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.max.z), 
            ));
            points.push(getMidplane(
                new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.min.z), 
                new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.max.z), 
                new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.min.z), 
                new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.max.z), 
            ));

            // z is fixed
            points.push(getMidplane(
                new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.min.z), 
                new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.min.z), 
                new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.min.z), 
                new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.min.z), 
            ));
            points.push(getMidplane(
                new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.max.z), 
                new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.max.z), 
                new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.max.z), 
                new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.max.z), 
            ));
        }
    }
}
