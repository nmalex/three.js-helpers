// intersect2D_2Segments(): find the 2D intersection of 2 finite segments
//    Input:  two finite segments S1 and S2
//    Output: *I0 = intersect point (when it exists)
//            *I1 =  endpoint of intersect segment [I0,I1] (when it exists)
//    Return: 0=disjoint (no intersect)
//            1=intersect  in unique point I0
//            2=overlap  in segment from I0 to I1
// int

THREE.Vector2.prototype.ortho = function(p) {
    if (p) {
        let x = this.x;
        this.x = this.y;
        this.y = -x;
        return this;
    } else {
        let x = this.x;
        this.x = -this.y;
        this.y = x;
        return this;
    }
}

THREE.Vector2.prototype.toVector3 = function(z) {
    return new THREE.Vector3(this.x, this.y, z);
}

THREE.Vector3.prototype.toVector2 = function() {
    return new THREE.Vector2(this.x, this.y);
}

THREE.Vector2.prototype.isLeft = function(a, b) {
    return ((b.x - a.x)*(this.y - a.y) - (b.y - a.y)*(this.x - a.x)) > 0;
}

const eps = 1e-6;
function dot(u,v) { return u.x * v.x + u.y * v.y + u.z * v.z }
function perp(u,v) { return u.x * v.y - u.y * v.x }

// inSegment(): determine if a point is inside a segment
//    Input:  a point P, and a collinear segment S
//    Return: 1 = P is inside S
//            0 = P is  not inside S
// int
function inSegment(P, S) //  Point P, Segment S
{
    if (S.P0.x !== S.P1.x) {    // S is not  vertical
        if (S.P0.x <= P.x && P.x <= S.P1.x)
            return 1;
        if (S.P0.x >= P.x && P.x >= S.P1.x)
            return 1;
    }
    else {    // S is vertical, so test y  coordinate
        if (S.P0.y <= P.y && P.y <= S.P1.y)
            return 1;
        if (S.P0.y >= P.y && P.y >= S.P1.y)
            return 1;
    }
    return 0;
}
 
function intersect2D_2Segments( S1, S2, I0, I1, segCheck ) // Segment S1, Segment S2, Point* I0, Point* I1
{
    let u = S1.P1.clone().sub(S1.P0); // Vector    u = S1.P1 - S1.P0;
    let v = S2.P1.clone().sub(S2.P0); // Vector    v = S2.P1 - S2.P0;
    let w = S1.P0.clone().sub(S2.P0); // Vector    w = S1.P0 - S2.P0;
    let D = perp(u,v); // float     D = perp(u,v);

    // test if  they are parallel (includes either being a point)
    if (Math.abs(D) < eps) {           // S1 and S2 are parallel
        if (perp(u,w) !== 0 || perp(v,w) !== 0)  {
            return 0;                    // they are NOT collinear
        }
        // they are collinear or degenerate
        // check if they are degenerate  points
        let du = dot(u,u);
        let dv = dot(v,v);
        if (du===0 && dv===0) {            // both segments are points
            if (S1.P0 !==  S2.P0)         // they are distinct  points
                 return 0;
            I0.x = S1.P0.x;                 // they are the same point
            I0.y = S1.P0.y;
            return 1;
        }
        if (du===0) {                     // S1 is a single point
            I0.x = S1.P0.x;
            I0.y = S1.P0.y;
            if  (segCheck && inSegment(S1.P0, S2) === 0)  // but is not in S2
                 return 0;
            return 1;
        }
        if (dv===0) {                     // S2 a single point
            I0.x = S2.P0.x;
            I0.y = S2.P0.y;
            if  (segCheck && inSegment(S2.P0, S1) === 0)  // but is not in S1
                 return 0;
            return 1;
        }
        // they are collinear segments - get  overlap (or not)
        let t0, t1;                    // endpoints of S1 in eqn for S2
        let w2 = S1.P1.clone().sub(S2.P0); // Vector w2 = S1.P1 - S2.P0;
        if (v.x !== 0) {
                 t0 = w.x / v.x;
                 t1 = w2.x / v.x;
        }
        else {
                 t0 = w.y / v.y;
                 t1 = w2.y / v.y;
        }
        if (t0 > t1) {                   // must have t0 smaller than t1
                 let t=t0; t0=t1; t1=t;    // swap if not
        }
        if (t0 > 1 || t1 < 0) {
            return 0;      // NO overlap
        }
        t0 = t0<0? 0 : t0;               // clip to min 0
        t1 = t1>1? 1 : t1;               // clip to max 1
        if (t0 === t1) {                  // intersect is a point
            let o = S2.P0 +  t0 * v;
            I0.x = o.x;
            I0.y = o.y;
            return 1;
        }

        // they overlap in a valid subsegment
        // *I0 = S2.P0 + t0 * v;
        let o0 = S2.P0.clone().add(v.multiplyScalar(t0));
        // *I1 = S2.P0 + t1 * v;
        I0.x = o0.x;
        I0.y = o0.y;

        if (I1) {
            let o1 = S2.P0.clone().add(v.multiplyScalar(t1));
            I1.x = o1.x;
            I1.y = o1.y;
        }

        return 2;
    }

    // the segments are skew and may intersect in a point
    // get the intersect parameter for S1
    let sI = perp(v,w) / D;

    // get the intersect parameter for S2
    let tI = perp(u,w) / D;

    // *I0 = S1.P0 + sI * u;                // compute S1 intersect point
    let o0 = S1.P0.clone().add(u.multiplyScalar(sI));
    I0.x = o0.x;
    I0.y = o0.y;

    if (segCheck && (sI < 0 || sI > 1))                // no intersect with S1
        return 0;
    if (segCheck && (tI < 0 || tI > 1))                // no intersect with S2
        return 0;

    return 1;
}
//===================================================================
