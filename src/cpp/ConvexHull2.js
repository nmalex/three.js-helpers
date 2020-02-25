// Copyright 2001 softSurfer, 2012 Dan Sunday
// This code may be freely used and modified for any purpose
// providing that this copyright notice is included with it.
// SoftSurfer makes no warranty for this code, and cannot be held
// liable for any real or imagined damage resulting from its use.
// Users of this code must verify correctness for their application.
 

// Assume that classes are already given for the objects:
//    Point with coordinates {float x, y;}
//===================================================================
 

// isLeft(): tests if a point is Left|On|Right of an infinite line.
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
//===================================================================


#define NONE (-1)

typedef struct range_bin Bin;
struct range_bin {
    int    min;    // index of min point P[] in bin (>=0 or NONE)
    int    max;    // index of max point P[] in bin (>=0 or NONE)
};
 


// nearHull_2D(): the BFP fast approximate 2D convex hull algorithm
//     Input:  P[] = an (unsorted) array of 2D points
//               n = the number of points in P[]
//               k = the approximation accuracy (large k = more accurate)
//     Output: H[] = an array of the convex hull vertices (max is n)
//     Return: the number of points in H[]
int
nearHull_2D( Point* P, int n, int k, Point* H )
{
    int    minmin=0, minmax=0;
    int    maxmin=0, maxmax=0;
    float  xmin = P[0].x, xmax = P[0].x;
    Point* cP;                  // the current point being considered
    int    bot=0, top=(-1);  // indices for bottom and top of the stack

    // Get the points with (1) min-max x-coord, and (2) min-max y-coord
    for (int i=1; i<n; i++) {
        cP = &P[i];
        if (cP->x <= xmin) {
            if (cP->x <  xmin) {         // new xmin
                 xmin = cP->x;
                 minmin = minmax = i;
            }
            else {                       // another xmin
                 if (cP->y < P[minmin].y)
                     minmin = i;
                 else if (cP->y > P[minmax].y)
                     minmax = i;
            }
        }
        if (cP->x >= xmax) {
            if (cP->x > xmax) {          // new xmax
                 xmax = cP->x;
                 maxmin = maxmax = i;
            }
            else {                       // another xmax
                 if (cP->y < P[maxmin].y)
                     maxmin = i;
                 else if (cP->y > P[maxmax].y)
                     maxmax = i;
            }
        }
    }
    if (xmin == xmax) {      //  degenerate case: all x-coords == xmin
        H[++top] = P[minmin];            // a point, or
        if (minmax != minmin)            // a nontrivial segment
            H[++top] =  P[minmax];
        return top+1;                    // one or two points
    }

    // Next, get the max and min points in the k range bins
    Bin*   B = new Bin[k+2];   // first allocate the bins
    B[0].min = minmin;          B[0].max = minmax;        // set bin 0
    B[k+1].min = maxmin;        B[k+1].max = maxmax;      // set bin k+1
    for (int b=1; b<=k; b++) { // initially nothing is in the other bins
        B[b].min = B[b].max = NONE;
    }
    for (int b, i=0; i<n; i++) {
        cP = &P[i];
        if (cP->x == xmin || cP->x == xmax)  // already have bins 0 and k+1
            continue;
        // check if a lower or upper point
        if (isLeft( P[minmin], P[maxmin], *cP) < 0) {  // below lower line
            b = (int)( k  * (cP->x - xmin) / (xmax - xmin) ) + 1;  // bin #
            if (B[b].min  == NONE)       // no min point in this range
                 B[b].min = i;           //  first min
            else if (cP->y < P[B[b].min]->y)
                 B[b].min = i;           // new  min
            continue;
        }
        if (isLeft( P[minmax], P[maxmax], *cP) > 0) {  // above upper line
            b = (int)( k  * (cP->x - xmin) / (xmax - xmin) ) + 1;  // bin #
            if (B[b].max == NONE)        // no max point in this range
                 B[b].max = i;           //  first max
            else if (cP->y > P[B[b].max]->y)
                 B[b].max = i;           // new  max
            continue;
        }
    }

    // Now, use the chain algorithm to get the lower and upper  hulls
    // the output array H[] will be used as the stack
    // First, compute the lower hull on the stack H
    for (int i=0; i <= k+1; ++i)
    {
        if (B[i].min == NONE)   // no min point in this range
            continue;
        cP = &P[ B[i].min ];    // select the current min point

        while (top > 0)         // there are at least 2 points on the stack
        {
            // test if current point is left of the line at the stack top
            if (isLeft(  H[top-1], H[top], *cP) > 0)
                 break;         // cP is a new hull vertex
            else
                 top--;         // pop top point off stack
        }
        H[++top] = *cP;         // push current point onto stack
    }

    // Next, compute the upper hull on the stack H above the bottom hull
    if (maxmax != maxmin)       // if  distinct xmax points
         H[++top] = P[maxmax];  // push maxmax point onto stack
    bot = top;                  // the bottom point of the upper hull stack
    for (int i=k; i >= 0; --i)
    {
        if (B[i].max == NONE)   // no max  point in this range
            continue;
        cP = &P[ B[i].max ];    //  select the current max point

        while (top > bot)       // at least 2 points on the upper stack
        {
            // test if  current point is left of the line at the stack top
            if (isLeft( H[top-1], H[top], *cP) > 0)
                 break;         // current point is a new hull vertex
            else
                 top--;         // pop top point off stack
        }
        H[++top] = *cP;         // push current point onto stack
    }
    if (minmax != minmin)
        H[++top] = P[minmin];   // push joining endpoint onto stack

    delete B;                   // free bins before returning
    return top+1;               // # of points on the stack
}