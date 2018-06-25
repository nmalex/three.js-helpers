class RayysSnap {
    constructor(threshold) {
        this.threshold = threshold;
        this.actors = [ ];
        this.targets = [ ];
    }

    snap(obj, previewValue) {
        for (let i=0; i<this.actors.length; i++) {
            let actor = this.actors[i];
            let res = actor.snap( obj, previewValue, undefined, this.threshold );
            if (res !== false) {
                return res;
            }
            for (let j=0; j<this.targets.length; j++) {
                let res = actor.snap( obj, previewValue, this.targets[j], this.threshold );
                if (res !== false) {
                    return res;
                }
            }
        }
        return false;
    }
}

class RayysPos3DSnapActor {
    snap( obj, previewPos, targetPos, threshold ) {
        if (previewPos.distanceTo(targetPos) < threshold) {
            return targetPos;
        }
        return false;
    }
}

class RayysGridSnapActor {
    constructor(dx, dy, dz) {
        this.dx = dx;
        this.dy = dy;
        this.dz = dz;
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
