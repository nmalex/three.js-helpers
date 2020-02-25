// Copyright 2002 softSurfer, 2012 Dan Sunday
// This code may be freely used and modified for any purpose
// providing that this copyright notice is included with it.
// SoftSurfer makes no warranty for this code, and cannot be held
// liable for any real or imagined damage resulting from its use.
// Users of this code must verify correctness for their application.
 

// Assume that classes are already given for the objects:
//    Point with coordinates {float x, y;}
//===================================================================
 

// isLeft(): test if a point is Left|On|Right of an infinite line.
//    Input:  three points P0, P1, and P2
//    Return: >0 for P2 left of the line through P0 and P1
//            =0 for P2 on the line
//            <0 for P2 right of the line
//    See: Algorithm 1 on Area of Triangles
inline float
isLeft( Point P0, Point P1, Point P2 )
{
    return (P1.x - P0.x)*(P2.y - P0.y) - (P2.x - P0.x)*(P1.y - P0.y);
}


// tests for polygon vertex ordering relative to a fixed point P
#define above(P,Vi,Vj)  (isLeft(P,Vi,Vj) > 0)   // true if Vi is above Vj
#define below(P,Vi,Vj)  (isLeft(P,Vi,Vj) < 0)   // true if Vi is below Vj
//===================================================================
 

// tangent_PointPoly(): find any polygon's exterior tangents
//    Input:  P = a 2D point (exterior to the polygon)
//            n = number of polygon vertices
//            V = array of vertices for any 2D polygon with V[n]=V[0]
//    Output: *rtan = index of rightmost tangent point V[*rtan]
//            *ltan = index of leftmost tangent point V[*ltan]
void
tangent_PointPoly( Point P, int n, Point* V, int* rtan, int* ltan )
{
    float  eprev, enext;        // V[i] previous and next edge turn direction

    *rtan = *ltan = 0;          // initially assume V[0] = both tangents
    eprev = isLeft(V[0], V[1], P);
    for (int i=1; i<n; i++) {
        enext = isLeft(V[i], V[i+1], P);
        if ((eprev <= 0) && (enext > 0)) {
            if (!below(P, V[i], V[*rtan]))
                 *rtan = i;
        }
        else if ((eprev > 0) && (enext <= 0)) {
            if (!above(P, V[i], V[*ltan]))
                 *ltan = i;
        }
        eprev = enext;
    }
    return;
}
//===================================================================
 


// tangent_PointPolyC(): fast binary search for tangents to a convex polygon
//    Input:  P = a 2D point (exterior to the polygon)
//            n = number of polygon vertices
//            V = array of vertices for a 2D convex polygon with V[n] = V[0]
//    Output: *rtan = index of rightmost tangent point V[*rtan]
//            *ltan = index of leftmost tangent point V[*ltan]
void
tangent_PointPolyC( Point P, int n, Point* V, int* rtan, int* ltan )
{
    *rtan = Rtangent_PointPolyC(P, n, V);
    *ltan = Ltangent_PointPolyC(P, n, V);
}


// Rtangent_PointPolyC(): binary search for convex polygon right tangent
//    Input:  P = a 2D point (exterior to the polygon)
//            n = number of polygon vertices
//            V = array of vertices for a 2D convex polygon with V[n] = V[0]
//    Return: index "i" of rightmost tangent point V[i]
int
Rtangent_PointPolyC( Point P, int n, Point* V )
{
    // use binary search for large convex polygons
    int     a, b, c;            // indices for edge chain endpoints
    int     upA, dnC;           // test for up direction of edges a and c

    // rightmost tangent = maximum for the isLeft() ordering
    // test if V[0] is a local maximum
    if (below(P, V[1], V[0]) && !above(P, V[n-1], V[0]))
        return 0;               // V[0] is the maximum tangent point

    for (a=0, b=n;;) {          // start chain = [0,n] with V[n]=V[0]
        c = (a + b) / 2;        // midpoint of [a,b], and 0<c<n
        dnC = below(P, V[c+1], V[c]);
        if (dnC && !above(P, V[c-1], V[c]))
            return c;          // V[c] is the maximum tangent point

        // no max yet, so continue with the binary search
        // pick one of the two subchains [a,c] or [c,b]
        upA = above(P, V[a+1], V[a]);
        if (upA) {                       // edge a points up
            if (dnC)                         // edge c points down
                 b = c;                           // select [a,c]
            else {                           // edge c points up
                 if (above(P, V[a], V[c]))     // V[a] above V[c]
                     b = c;                       // select [a,c]
                 else                          // V[a] below V[c]
                     a = c;                       // select [c,b]
            }
        }
        else {                           // edge a points down
            if (!dnC)                        // edge c points up
                 a = c;                           // select [c,b]
            else {                           // edge c points down
                 if (below(P, V[a], V[c]))     // V[a] below V[c]
                     b = c;                       // select [a,c]
                 else                          // V[a] above V[c]
                     a = c;                       // select [c,b]
            }
        }
    }
}
 


// Ltangent_PointPolyC(): binary search for convex polygon left tangent
//    Input:  P = a 2D point (exterior to the polygon)
//            n = number of polygon vertices
//            V = array of vertices for a 2D convex polygon with V[n]=V[0]
//    Return: index "i" of leftmost tangent point V[i]
int
Ltangent_PointPolyC( Point P, int n, Point* V )
{
    // use binary search for large convex polygons
    int     a, b, c;            // indices for edge chain endpoints
    int     dnA, dnC;           // test for down direction of edges a and c

    // leftmost tangent = minimum for the isLeft() ordering
    // test if V[0] is a local minimum
    if (above(P, V[n-1], V[0]) && !below(P, V[1], V[0]))
        return 0;               // V[0] is the minimum tangent point

    for (a=0, b=n;;) {          // start chain = [0,n] with V[n] = V[0]
        c = (a + b) / 2;        // midpoint of [a,b], and 0<c<n
        dnC = below(P, V[c+1], V[c]);
        if (above(P, V[c-1], V[c]) && !dnC)
            return c;          // V[c] is the minimum tangent point

        // no min yet, so continue with the binary search
        // pick one of the two subchains [a,c] or [c,b]
        dnA = below(P, V[a+1], V[a]);
        if (dnA) {                       // edge a points down
            if (!dnC)                        // edge c points up
                 b = c;                           // select [a,c]
            else {                           // edge c points down
                 if (below(P, V[a], V[c]))     // V[a] below V[c]
                     b = c;                       // select [a,c]
                 else                          // V[a] above V[c]
                     a = c;                       // select [c,b]
            }
        }
        else {                           // edge a points up
            if (dnC)                         // edge c points down
                 a = c;                           // select [c,b]
            else {                           // edge c points up
                 if (above(P, V[a], V[c]))     // V[a] above V[c]
                     b = c;                       // select [a,c]
                 else                          // V[a] below V[c]
                     a = c;                       // select [c,b]
            }
        }
    }
}
//===================================================================
 


// RLtangent_PolyPolyC(): get the RL tangent between two convex polygons
//    Input:  m = number of vertices in polygon 1
//            V = array of vertices for convex polygon 1 with V[m]=V[0]
//            n = number of vertices in polygon 2
//            W = array of vertices for convex polygon 2 with W[n]=W[0]
//    Output: *t1 = index of tangent point V[t1] for polygon 1
//            *t2 = index of tangent point W[t2] for polygon 2
void
RLtangent_PolyPolyC( int m, Point* V, int n, Point* W, int* t1, int* t2 )
{
    int ix1, ix2;      // search indices for polygons 1 and 2

    // first get the initial vertex on each polygon
    ix1 = Rtangent_PointPolyC(W[0], m, V);   // right tangent from W[0] to V
    ix2 = Ltangent_PointPolyC(V[ix1], n, W); // left tangent from V[ix1] to W

    // ping-pong linear search until it stabilizes
    int done = FALSE;                    // flag when done
    while (done == FALSE) {
        done = TRUE;                     // assume done until...
        while (isLeft(W[ix2], V[ix1], V[ix1+1]) <= 0){
            ++ix1;                       // get Rtangent from W[ix2] to V
        }
        while (isLeft(V[ix1], W[ix2], W[ix2-1]) >= 0){
            --ix2;                       // get Ltangent from V[ix1] to W
            done = FALSE;                // not done if had to adjust this
        }
    }
    *t1 = ix1;
    *t2 = ix2;
    return;
}
//===================================================================