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
