// Copyright 2002 softSurfer, 2012-2013 Dan Sunday
// This code may be freely used, distributed and modified for any
// purpose providing that this copyright notice is included with it.
// SoftSurfer makes no warranty for this code, and cannot be held
// liable for any real or imagined damage resulting from its use.
// Users of this code must verify correctness for their application.
 

// Assume that classes are already given for the objects:
//    Point and Vector (2D) with:
//        coordinates {float x, y;}
//        operators for:
//            == to test equality
//            != to test inequality
//            =  for assignment
//            -Vector for unary minus
//            Point  = Point ± Vector
//            Vector = Point - Point
//            Vector = Vector ± Vector
//    Line with defining points {Point P0, P1;}
//===================================================================


// dot product (2D) which allows vector operations in arguments
#define dot(u,v)   ((u).x * (v).x + (u).y * (v).y)

// tests for vector orientation relative to a direction vector u
#define up(u,v)         (dot(u,v) > 0)
#define down(u,v)       (dot(u,v) < 0)
#define dr(u,Vi,Vj)     (dot(u, (Vi)-(Vj))) // direction sign of (Vi-Vj)
#define above(u,Vi,Vj)  (dr(u,Vi,Vj) > 0)   // true if Vi is above Vj
#define below(u,Vi,Vj)  (dr(u,Vi,Vj) < 0)   // true if Vi is below Vj
 

// polyMax_2D(): find a polygon's max vertex in a specified direction
//    Input:  U   = a 2D direction vector
//            V[] = array vertices of a proper convex polygon
//            n   = number of polygon vertices, with V[n]=V[0]
//    Return: index (>=0) of the maximum vertex, or
//            (-1) = an error [Note: should be impossible, but...]
int
polyMax_2D( Vector U, Point* V, int n )
{
    if (n < 10) {               // use brute force search for small polygons
        int max = 0;
        for (int i=1; i<n; i++)     // for each point in {V1,...,Vn-1}
            if (above(U, V[i], V[max]))  // if V[i] is above prior V[max]
                 max = i;                // new max index = i
        return max;
    }

    // use binary search for large polygons
    int     a, b, c;            // indices for edge chain endpoints
    Vector  A, C;               // edge vectors at V[a] and V[c]
    int     upA, upC;           // test for "up" direction of A and C

    a=0; b=n;                   // start chain = [0,n] with V[n]=V[0]
    A = V[1] - V[0];
    upA = up(U,A);
    // test if V[0] is a local maximum
    if (!upA && !above(U, V[n-1], V[0]))    //  V[0] is the maximum
        return 0;

    for(;;) {
        c = (a + b) / 2;        // midpoint of [a,b], and 0<c<n
        C = V[c+1] - V[c];
        upC = up(U,C);
        if (!upC && !above(U, V[c-1], V[c])) // V[c] is a local maximum
            return c;                        // thus it is the maximum

        // no max yet, so continue with the  binary search
        // pick one of the two subchains [a,c]  or [c,b]
        if (upA) {                       // A points up
            if (!upC) {                      // C points down
                 b = c;                       // select [a,c]
            }
            else {                           // C points up
                 if (above(U, V[a], V[c])) {    // V[a] above V[c]
                     b = c;                       // select [a,c]
                 }
                 else {                         // V[a] below V[c]
                     a = c;                       // select [c,b]
                     A = C;
                     upA = upC;
                 }
            }
        }
        else {                           // A points down
            if (upC) {                       // C points up
                 a = c;                       // select [c,b]
                 A = C;
                 upA = upC;
            }
            else {                           // C points down
                 if (below(U, V[a], V[c])) {    // V[a] below V[c]
                     b = c;                       // select [a,c]
                 }
                 else {                         // V[a] above V[c]
                     a = c;                       // select [c,b]
                     A = C;
                     upA = upC;
                 }
            }
        }
        // have a new (reduced) chain [a,b]
        if (b <= a+1)           // the chain is impossibly small
            return (-1);        // return an error: something's wrong
    }
}
//===================================================================


// dist2D_Poly_to_Line(): find the distance from a polygon to a line
//    Input:  V[] = array vertices of a proper convex polygon
//            n    = the number of polygon vertices, with V[n] = V[0]
//            L    = a Line (defined by 2 points P0 and P1)
//    Return: minimum distance from V[] to L
float
dist2D_Poly_to_Line( Point* V, int n, Line L )
{
    Vector    U, N;
    int       max;

    // get a leftward normal N to L
    N.x = -(L.P1.y - L.P0.y);
    N.y =  (L.P1.x - L.P0.x);
    // get a normal U to L with V[0] on U-backside
    if (dot(N, V[0] - L.P0) <= 0)
        U = N;
    else U = -N;

    max = polyMax_2D( U, V, n );         // max vertex in U direction

    if (dot(U, V[max] - L.P0) > 0)       // V[max] on U-positive side
        return 0;                        // so polygon and line intersect
    else
        return dist_Point_to_Line( V[max], L);  // min dist to line L
}
//===================================================================