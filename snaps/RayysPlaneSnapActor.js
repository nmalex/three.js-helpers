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

        let canSnap =                 RayysMiscHelpers.vectorsEqual(previewPlane.normal, targetPlane.normal, 1e-6) 
            || this.snapBackfacing && RayysMiscHelpers.vectorsEqual(previewPlane.normal, targetPlane.normal.clone().negate(), 1e-6);

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
