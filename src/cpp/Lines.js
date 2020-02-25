// Copyright 2001 softSurfer, 2012 Dan Sunday
// This code may be freely used, distributed and modified for any purpose
// providing that this copyright notice is included with it.
// SoftSurfer makes no warranty for this code, and cannot be held
// liable for any real or imagined damage resulting from its use.
// Users of this code must verify correctness for their application.
 

// Assume that classes are already given for the objects:
//     Point and Vector with
//          coordinates {float x, y, z;} (z=0  for 2D)
//          appropriate operators for:
//               Point  = Point ± Vector
//               Vector = Point - Point
//               Vector = Scalar * Vector
//     Line with defining endpoints {Point P0, P1;}
//     Segment with defining endpoints {Point P0, P1;}
//===================================================================

// dot product (3D) which allows vector operations in arguments
#define dot(u,v)   ((u).x * (v).x + (u).y * (v).y + (u).z * (v).z)
#define norm(v)     sqrt(dot(v,v))     // norm = length of  vector
#define d(u,v)      norm(u-v)          // distance = norm of difference
 


// closest2D_Point_to_Line(): find the closest 2D Point to a Line
//     Input:  an array P[] of n points, and a Line L
//     Return: the index i of the Point P[i] closest to L
int
closest2D_Point_to_Line( Point P[], int n, Line L)
{
     // Get coefficients of the implicit line equation.
     // Do NOT normalize since scaling by a constant
     // is irrelevant for just comparing distances.
     float a = L.P0.y - L.P1.y;
     float b = L.P1.x - L.P0.x;
     float c = L.P0.x * L.P1.y - L.P1.x * L.P0.y;

     // initialize min index and distance to P[0]
     int mi = 0;
     float min = a * P[0].x + b * P[0].y + c;
     if (min < 0) min = -min;     // absolute value

     // loop through Point array testing for min distance to L
     for (i=1; i<n; i++) {
          // just use dist squared (sqrt not  needed for comparison)
          float dist = a * P[i].x + b * P[i].y  + c;
          if (dist < 0) dist = -dist;    // absolute value
          if (dist < min) {      // this point is closer
               mi = i;              // so have a new minimum
               min = dist;
          }
     }
     return mi;     // the index of the closest  Point P[mi]
}
//===================================================================


// dist_Point_to_Line(): get the distance of a point to a line
//     Input:  a Point P and a Line L (in any dimension)
//     Return: the shortest distance from P to L
float
dist_Point_to_Line( Point P, Line L)
{
     Vector v = L.P1 - L.P0;
     Vector w = P - L.P0;

     double c1 = dot(w,v);
     double c2 = dot(v,v);
     double b = c1 / c2;

     Point Pb = L.P0 + b * v;
     return d(P, Pb);
}
//===================================================================


// dist_Point_to_Segment(): get the distance of a point to a segment
//     Input:  a Point P and a Segment S (in any dimension)
//     Return: the shortest distance from P to S
float
dist_Point_to_Segment( Point P, Segment S)
{
     Vector v = S.P1 - S.P0;
     Vector w = P - S.P0;

     double c1 = dot(w,v);
     if ( c1 <= 0 )
          return d(P, S.P0);

     double c2 = dot(v,v);
     if ( c2 <= c1 )
          return d(P, S.P1);

     double b = c1 / c2;
     Point Pb = S.P0 + b * v;
     return d(P, Pb);
}
//===================================================================