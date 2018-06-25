class RayysSnap {
    constructor(threshold) {
        this.threshold = threshold;
        this.checks = [ ];
        this.targets = [ ];
    }

    snap(obj) {
        for (let i=0; i<this.checks.length; i++) {
            for (let j=0; j<this.targets.length; j++) {
                let res = this.checks[i].snap( obj, this.targets[j], this.threshold );
                if (res !== false) {
                    return res;
                }
            }
        }
        return false;
    }
}

class RayysPos3DSnap {
    snap( obj, targetPos, threshold ) {
        if (obj.position.distanceTo(targetPos) < threshold) {
            return targetPos;
        }
        return false;
    }
}
