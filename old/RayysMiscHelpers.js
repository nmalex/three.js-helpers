class RayysMiscHelpers {
    static makeTranslationFromVector(offs) {
        return new THREE.Matrix4().makeTranslation(offs.x, offs.y, offs.z);
    };
    
    static vectorsEqual(v1, v2, eps) {
        return  Math.abs(v1.x - v2.x) < eps 
             && Math.abs(v1.y - v2.y) < eps 
             && Math.abs(v1.z - v2.z) < eps ;
    }
    
    static isZero(val, eps) {
        return Math.abs(val) < eps;
    }
}