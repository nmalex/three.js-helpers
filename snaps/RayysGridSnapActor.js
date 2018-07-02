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
