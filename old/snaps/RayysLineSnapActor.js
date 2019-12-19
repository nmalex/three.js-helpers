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

        if (!RayysMiscHelpers.vectorsEqual(previewDir, targetDir, 1e-6)) {
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
