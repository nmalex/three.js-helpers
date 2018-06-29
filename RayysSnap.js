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
    snap(other, actor, isTwoSided) {

    }

    getNode() {
        // todo: create scene node to visualize snap points, lines and planes
    }
}

// SnapMaker will create a snap target from given object. Different factories 
// may return very specific collections of snap targets.
class BBoxSnapFactory {
    constructor() {
    }

    // creates snap target for given scene object
    create(obj, snapToPivot, snapToPoints, snapToLines, snapToPlanes, snapToMidlines, snapToMidplanes) {
        var snapTarget = new SnapTarget();
        update(obj, snapTarget, snapToPivot, snapToPoints, snapToLines, snapToPlanes, snapToMidlines, snapToMidplanes);
        return snapTarget;
    }

    update(obj, snapTargetRef, snapToPivot, snapToPoints, snapToLines, snapToPlanes, snapToMidlines, snapToMidplanes) {
        if (obj.boundingBox === undefined) {
            obj.computeBoundingBox();
        }
        var bbox = obj.boundingBox;

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

class RayysSnap {
    constructor(threshold) {
        this.threshold = threshold;

        // which snap actors you want to use?
        this.actors = [ ];

        // which objects you want to snap to each other?
        this.objects = [ ];
        // this is a collection of id => targets, where as id is scene object id, and targets are this object's targets
        this.targets = { };

        // which snap factory should be used to generate targets?
        this.factory = new BBoxSnapFactory();
    }

    // this will return snapped object position for the object being manipulated and raw object position
    snap(obj, previewPos) {

    }

    // todo: rework it
    snap(objectSnaps, previewValue) {
        for (let i=0; i<this.actors.length; i++) {
            let actor = this.actors[i];

            // try to snap to the world, here procedural snaps may apply, 
            // like grid snap which does not require specific targets
            let res = actor.snap( objectSnaps, previewValue, undefined, this.threshold );
            if (res !== false) {
                return res;
            }

            // next try to check given snaps with existing snap targets
            for (let j=0; j<this.targets.length; j++) {
                let res = actor.snap( objectSnaps, previewValue, this.targets[j], this.threshold );
                if (res !== false) {
                    return res;
                }
            }
        }
        return false;
    }
}

class RayysPointSnapActor {
    snap( obj, previewPos, targetPos, threshold ) {
        if (previewPos.distanceTo(targetPos) < threshold) {
            return targetPos;
        }
        return false;
    }
}

class RayysLineSnapActor {

}

class RayysPlaneSnapActor {

}

class RayysGridSnapActor {
    constructor(dx, dy, dz) {
        this.dx = dx;
        this.dy = dy;
        this.dz = dz;
        this.isProcedural = true;
    }
    snap( obj, previewPos, targetPos, threshold ) {
        let x = Math.floor(previewPos.x / this.dx) * this.dx;
        let y = Math.floor(previewPos.y / this.dy) * this.dy;
        let z = Math.floor(previewPos.z / this.dz) * this.dz;

        let resPos = previewPos.clone();

        resPos.x = x;
        resPos.y = y;
        resPos.z = z;

        return resPos;
    }
}
