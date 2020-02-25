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
//            Point  = Point ± Vector
//            Vector = Point - Point
//            Vector = Vector ± Vector
//            Vector = Scalar * Vector    (scalar product)
//            Vector = Vector / Scalar    (scalar division)
//
//    Ball with a center and radius {Point center; float radius;}
//===================================================================
 

// dot product which allows  vector operations in arguments
#define dot(u,v)   ((u).x * (v).x + (u).y * (v).y)
#define norm2(v)   dot(v,v)         // norm2 = squared length of vector
#define norm(v)    sqrt(norm2(v))  // norm = length of  vector
#define d(u,v)     norm(u-v)        // distance = norm of difference
 


// fastBall(): get a fast approximation for the 2D bounding ball
//              (based on the algorithm given by [Jack Ritter, 1990])
//    Input:  an array P[] of n points (2D xy coords)
//    Output: a bounding ball = {Point center; float radius;}
void
fastBall( Point P[], int n, Ball* B)
{
    Point C;                            // Center of ball
    float rad, rad2;                    // radius and radius squared
    float xmin, xmax, ymin, ymax;       // bounding box extremes
    int   Pxmin, Pxmax, Pymin, Pymax;   // index of  P[] at box extreme

    // find a large diameter to start with
    // first get the bounding box and P[] extreme points for it
    xmin = xmax = P[0].x;
    ymin = ymax = P[0].y;
    Pxmin = Pxmax = Pymin = Pymax = 0;
    for (int i=1; i<n; i++) {
        if (P[i].x < xmin) {
            xmin = P[i].x;
            Pxmin = i;
        }
        else if (P[i].x > xmax) {
            xmax = P[i].x;
            Pxmax = i;
        }
        if (P[i].y < ymin) {
            ymin = P[i].y;
            Pymin = i;
        }
        else if (P[i].y > ymax) {
            ymax = P[i].y;
            Pymax = i;
        }
    }
    // select the largest extent as an initial diameter for the  ball
    Vector dPx = P[Pxmax] - P[Pxmin]; // diff of Px max and min
    Vector dPy = P[Pymax] - P[Pymin]; // diff of Py max and min
    float dx2 = norm2(dPx); // Px diff squared
    float dy2 = norm2(dPy); // Py diff squared
    if (dx2 >= dy2) {                      // x direction is largest extent
        C = P[Pxmin] + (dPx / 2.0);          // Center = midpoint of extremes
        rad2 = norm2(P[Pxmax] - C);          // radius squared
    }
    else {                                 // y direction is largest extent
        C = P[Pymin] + (dPy / 2.0);          // Center = midpoint of extremes
        rad2 = norm2(P[Pymax] - C);          // radius squared
    }
    rad = sqrt(rad2);

    // now check that all points P[i] are in the ball
    // and if not, expand the ball just enough to include them
    Vector dP;
    float dist, dist2;
    for (int i=0; i<n; i++) {
        dP = P[i] - C;
        dist2 = norm2(dP);
        if (dist2 <= rad2)     // P[i] is inside the ball already
            continue;
        // P[i] not in ball, so expand ball  to include it
        dist = sqrt(dist2);
        rad = (rad + dist) / 2.0;          // enlarge radius just enough
        rad2 = rad * rad;
        C = C + ((dist-rad)/dist) * dP;    // shift Center toward P[i]
    }
    B->center = C;
    B->radius = rad;
    return;
}