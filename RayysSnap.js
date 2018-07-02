var makeTranslationFromVector = function(offs) {
    return new THREE.Matrix4().makeTranslation(offs.x, offs.y, offs.z);
};

var vectorsEqual = function(v1, v2, eps) {
    return  Math.abs(v1.x - v2.x) < eps 
         && Math.abs(v1.y - v2.y) < eps 
         && Math.abs(v1.z - v2.z) < eps ;
}

var isZero = function(val, eps) {
    return Math.abs(val) < eps;
}

// snap target may be of 1 of 3 types:
// 1. Vector3 - point in world space
// 2. Line - line in world space
// 3. Plane - plane in world space
class SnapTarget {
    constructor() {
        this.localMatrix = new THREE.Matrix4();
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
                    if (snapOffs && !vectorsEqual(zeroSnap, snapOffs, 1e-6)) {
                        // console.log(`Snap points ${JSON.stringify(previewPos)} to ${JSON.stringify(snapOffs)}`);
                        return snapOffs;
                    }
                }
            }
        }
        if (actor.canSnapLines) {
            for (let i=0; i<this.lines.length; i++) {
                let line = this.lines[i];
                let previewLine = line.clone().applyMatrix4( makeTranslationFromVector(previewOffset) );

                for (let j=0; j<other.lines.length; j++) {
                    let targetLine = other.lines[j];
                    let snapOffs = actor.snap( null, previewLine, targetLine );
                    if (snapOffs && !vectorsEqual(zeroSnap, snapOffs, 1e-6)) {
                        // console.log(`Snap lines ${JSON.stringify(previewLine)} to ${JSON.stringify(snapOffs)}`);
                        return snapOffs;
                    }
                }
            }
        }
        if (actor.canSnapPlanes) {
            for (let i=0; i<this.planes.length; i++) {
                let plane = this.planes[i];
                let previewPlane = plane.clone().applyMatrix4( makeTranslationFromVector(previewOffset) );

                for (let j=0; j<other.planes.length; j++) {
                    let targetPlane = other.planes[j];
                    let snapOffs = actor.snap( null, previewPlane, targetPlane );
                    if (snapOffs && !vectorsEqual(zeroSnap, snapOffs, 1e-6)) {
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

// SnapMaker will create a snap target from given object. Different factories 
// may return very specific collections of snap targets.
class BBoxSnapFactory {
    constructor() {
    }

    // creates snap target for given scene object
    create(obj, snapToPivot, snapToPoints, snapToLines, snapToPlanes, snapToMidlines, snapToMidplanes) {
        var snapTarget = new SnapTarget();
        snapTarget.localMatrix.copy( obj.matrix );
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
        snapTargetRef.localMatrix.copy( obj.matrix );

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
        this.actors = [ 
            new RayysPointSnapActor(0.2),
            new RayysLineSnapActor(0.2),
            new RayysPlaneSnapActor(0.2, true)
        ];

        // which objects you want to snap to each other?
        this.objects = [ ];
        // this is a collection of id => targets, where as id is scene object id, and targets are this object's targets
        this.targets = { };
        this.targetNodes = { };

        // which snap factory should be used to generate targets?
        this.factory = new BBoxSnapFactory();
    }

    add(obj) {
        this.objects.push( obj );
        var targets = this.factory.create(obj, true, true, true, true, true, true) ;
        this.targets[ obj.id ] = targets;

        let node = targets.getNode();
        this.targetNodes [ obj.id ] = node;
        return node;
    }

    update(obj) {
        this.factory.update(obj, this.targets[ obj.id ], true, true, true, true, true, true) ;
        let node = this.targets[ obj.id ].getNode();
        this.targetNodes [ obj.id ] = node;
        return node;
    }

    getTargets(obj) {
        return this.targets [ obj.id ];
    }

    getTargetsNode(obj) {
        return this.targetNodes [ obj.id ];
    }

    // this will return snapped object position for the object being manipulated and raw object position
    snap(obj, previewPos) {

        let objTargets = this.targets[ obj.id ];

        let previewOffset = previewPos.clone().sub(obj.position);
        let snapInfo = {
            point: {
                snapped: { x: false, y: false, z: false },
                offset: undefined
            },
            line: {
                snapped: { x: false, y: false, z: false },
                offset: undefined
            },
            plane: {
                snapped: { x: false, y: false, z: false },
                offset: undefined
            }
        };

        for (let actorId in this.actors) {
            let activeActor = this.actors[ actorId ]; // select snap actor

            for (let targetId in this.targets) {
                if (targetId == obj.id) continue; //skip self

                let other = this.targets[ targetId ];
                let snapOffs = objTargets.snap(previewOffset, other, activeActor);

                if (snapOffs) {
                    if (snapInfo[activeActor.type].offset === undefined) {
                        snapInfo[activeActor.type].offset = snapOffs;
                        snapInfo[activeActor.type].snapped.x = !isZero(snapOffs.x, 1e-6);
                        snapInfo[activeActor.type].snapped.y = !isZero(snapOffs.y, 1e-6);
                        snapInfo[activeActor.type].snapped.z = !isZero(snapOffs.z, 1e-6);
                    } else {
                        // snap offset may accumulate, when you snap to the numerous matching targets
                        if (!isZero(snapOffs.x, 1e-6) && !snapInfo[activeActor.type].snapped.x) {
                            snapInfo[activeActor.type].offset.x += snapOffs.x;
                            snapInfo[activeActor.type].snapped.x = true;
                        }
                        if (!isZero(snapOffs.y, 1e-6) && !snapInfo[activeActor.type].snapped.y) {
                            snapInfo[activeActor.type].offset.y += snapOffs.y;
                            snapInfo[activeActor.type].snapped.y = true;
                        }
                        if (!isZero(snapOffs.z, 1e-6) && !snapInfo[activeActor.type].snapped.z) {
                            snapInfo[activeActor.type].offset.z += snapOffs.z;
                            snapInfo[activeActor.type].snapped.z = true;
                        }
                    }
                }
            }
        }

        // now see priority, point will override all other snaps
        if (snapInfo["point"].offset) {
            return previewPos.clone().add(snapInfo["point"].offset);
        }

        // line snap will override plane snap
        if (snapInfo["line"].offset) {
            return previewPos.clone().add(snapInfo["line"].offset);
        }

        // plane snap is least restrictive, goes the last
        if (snapInfo["plane"].offset) {
            return previewPos.clone().add(snapInfo["plane"].offset);
        }

        return undefined;
    }
}

class RayysPointSnapActor {
    constructor(threshold) {
        this.threshold = threshold;

        this.type = "point";

        this.canSnapPoints = true;
        this.canSnapLines = false;
        this.canSnapPlanes = false;
    }

    snap( obj, previewPos, targetPos ) {
        if (previewPos.distanceTo(targetPos) < this.threshold) {
            return targetPos.clone().sub(previewPos);
        }
        return false;
    }
}

class RayysLineSnapActor {
    constructor(threshold) {
        this.threshold = threshold;

        this.type = "line";

        this.canSnapPoints = false;
        this.canSnapLines = true;
        this.canSnapPlanes = false;
    }

    snap( obj, previewLine, targetLine ) {
        // this has to be perf improved
        let previewDir = (previewLine.end.clone().sub( previewLine.start )).normalize();
        let targetDir = (targetLine.end.clone().sub( targetLine.start )).normalize();

        if (!vectorsEqual(previewDir, targetDir, 1e-6)) {
            return false;
        }

        let closestPoint = new THREE.Vector3();
        targetLine.closestPointToPoint ( previewLine.start, false, closestPoint );

        if (closestPoint.distanceTo(previewLine.start) < this.threshold) {
            return closestPoint.sub(previewLine.start);
        }
        return false;
    }
}

class RayysPlaneSnapActor {
    constructor(threshold, snapBackfacing) {
        this.threshold = threshold;
        this.snapBackfacing = snapBackfacing || false;

        this.type = "plane";

        this.canSnapPoints = false;
        this.canSnapLines = false;
        this.canSnapPlanes = true;
    }

    snap( obj, previewPlane, targetPlane ) {

        let canSnap =                 vectorsEqual(previewPlane.normal, targetPlane.normal, 1e-6) 
            || this.snapBackfacing && vectorsEqual(previewPlane.normal, targetPlane.normal.clone().negate(), 1e-6);

        if (!canSnap) return false;

        let targetPoint = new THREE.Vector3();
        targetPlane.coplanarPoint ( targetPoint );

        let previewPoint = new THREE.Vector3();
        previewPlane.projectPoint ( targetPoint, previewPoint )

        if (Math.abs(targetPoint.distanceTo(previewPoint)) < this.threshold) {
            return targetPoint.sub(previewPoint);
        }
        return false;
    }
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
