// Copyright 2001 softSurfer, 2012 Dan Sunday
// This code may be freely used and modified for any purpose
// providing that this copyright notice is included with it.
// SoftSurfer makes no warranty for this code, and cannot be held
// liable for any real or imagined damage resulting from its use.
// Users of this code must verify correctness for their application.
 

// Assume that classes are already given for the objects:
//    Point and Vector with
//        coordinates {float x, y;}
//        operators for:
//            == to test equality
//            != to test inequality
//            Point  = Point ± Vector
//            Vector = Point - Point
//            Vector = Vector ± Vector
//            Vector = Scalar * Vector    (scalar product)
//    Segment with defining endpoints {Point P0, P1;}
//===================================================================
 

#define TRUE       1
#define FALSE      0
#define SMALL_NUM  0.00000001 // anything that avoids division overflow

#define dot(u,v)   ((u).x * (v).x + (u).y * (v).y)   // 2D dot product
#define perp(u,v)  ((u).x * (v).y - (u).y * (v).x)   // 2D perp product
 


// intersect2D_SegPoly(): intersect a 2D segment with a convex polygon
//    Input:  S = 2D segment to intersect with the convex polygon V[]
//            n = number of 2D points in the polygon
//            V[] = array of n+1 vertex points with V[n] = V[0]
//      Note: The polygon MUST be convex and
//                have vertices oriented counterclockwise (ccw).
//            This code does not check for and verify these conditions.
//    Output: *IS = the intersection segment (when it exists)
//    Return: FALSE = no intersection
//            TRUE  = a valid intersection segment exists
int
intersect2D_SegPoly( Segment S, Point* V, int n, Segment* IS)
{
    if (S.P0 == S.P1) {         // the segment S is a single point
        // test for inclusion of S.P0 in the polygon
        *IS = S;                // same point if inside polygon
        return cn_PnPoly( S.P0, V, n );
    }

    float  tE = 0;              // the maximum entering segment parameter
    float  tL = 1;              // the minimum leaving segment parameter
    float  t, N, D;             // intersect parameter t = N / D
    Vector dS = S.P1- S.P0;     // the  segment direction vector
    Vector e;                   // edge vector
    // Vector ne;               // edge outward normal (not explicit in code)

    for (int i=0; i < n; i++)   // process polygon edge V[i]V[i+1]
    {
        e = V[i+1] - V[i];
        N = perp(e, S.P0-V[i]); // = -dot(ne, S.P0 - V[i])
        D = -perp(e, dS);       // = dot(ne, dS)
        if (fabs(D) < SMALL_NUM) {  // S is nearly parallel to this edge
            if (N < 0)              // P0 is outside this edge, so
                 return FALSE;      // S is outside the polygon
            else                    // S cannot cross this edge, so
                 continue;          // ignore this edge
        }

        t = N / D;
        if (D < 0) {            // segment S is entering across this edge
            if (t > tE) {       // new max tE
                 tE = t;
                 if (tE > tL)   // S enters after leaving polygon
                     return FALSE;
            }
        }
        else {                  // segment S is leaving across this edge
            if (t < tL) {       // new min tL
                 tL = t;
                 if (tL < tE)   // S leaves before entering polygon
                     return FALSE;
            }
        }
    }

    // tE <= tL implies that there is a valid intersection subsegment
    IS->P0 = S.P0 + tE * dS;   // = P(tE) = point where S enters polygon
    IS->P1 = S.P0 + tL * dS;   // = P(tL) = point where S leaves polygon
    return TRUE;
}