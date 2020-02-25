// Copyright 2001 softSurfer, 2012 Dan Sunday
// This code may be freely used and modified for any purpose
// providing that this copyright notice is included with it.
// SoftSurfer makes no warranty for this code, and cannot be held
// liable for any real or imagined damage resulting from its use.
// Users of this code must verify correctness for their application.
 

// Assume that classes are already given for the objects:
//    Point with 2D coordinates {float x, y;}
//    Polygon with n vertices {int n; Point *V;} with V[n]=V[0]
//    Tnode is a node element structure for a BBT
//    BBT is a class for a Balanced Binary Tree
//        such as an AVL, a 2-3, or a  red-black tree
//        with methods given by the  placeholder code:

typedef struct _BBTnode Tnode;
struct _BBTnode {
        void* val;
        // plus node mgmt info ...
};

class BBT {
        Tnode   *root;
public:
                 BBT() {root = (Tnode*)0;}   // constructor
                 ~BBT() {freetree();}        // destructor

        Tnode*  insert( void* ){};       // insert data into the tree
        Tnode*  find( void* ){};         // find data from the tree
        Tnode*  next( Tnode* ){};        // get next tree node
        Tnode*  prev( Tnode* ){};        // get previous tree node
        void    remove( Tnode*  ){};     // remove node from the tree
        void    freetree(){};            // free all tree data structs
};
// NOTE:
// Code for these methods must be provided for the algorithm to work.
// We have not provided it since binary tree algorithms are well-known
// and code is widely available. Further, we want to reduce the clutter
// accompanying the essential sweep line algorithm.
//===================================================================
 

#define FALSE   0
#define TRUE    1
#define LEFT    0
#define RIGHT   1

extern void
qsort(void*, unsigned, unsigned, int(*)(const void*,const void*));

// xyorder(): determines the xy lexicographical order of two points
//      returns: (+1) if p1 > p2; (-1) if p1 < p2; and  0 if equal
int xyorder( Point* p1, Point* p2 )
{
    // test the x-coord first
    if (p1->x > p2->x) return 1;
    if (p1->x < p2->x) return (-1);
    // and test the y-coord second
    if (p1->y > p2->y) return 1;
    if (p1->y < p2->y) return (-1);
    // when you exclude all other possibilities, what remains  is...
    return 0;  // they are the same point
}

// isLeft(): tests if point P2 is Left|On|Right of the line P0 to P1.
//      returns: >0 for left, 0 for on, and <0 for  right of the line.
//      (see Algorithm 1 on Area of Triangles)
inline float
isLeft( Point P0, Point P1, Point P2 )
{
    return (P1.x - P0.x)*(P2.y - P0.y) - (P2.x - P0.x)*(P1.y -  P0.y);
}
//===================================================================
 


// EventQueue Class

// Event element data struct
typedef struct _event Event;
struct _event {
    int      edge;          // polygon edge i is V[i] to V[i+1]
    int      type;          // event type: LEFT or RIGHT vertex
    Point*   eV;            // event vertex
};

int E_compare( const void* v1, const void* v2 ) // qsort compare two events
{
    Event**    pe1 = (Event**)v1;
    Event**    pe2 = (Event**)v2;

    return xyorder( (*pe1)->eV, (*pe2)->eV );
}

// the EventQueue is a presorted array (no insertions needed)
class EventQueue {
    int      ne;                // total number of events in array
    int      ix;                // index of next event on queue
    Event*   Edata;             // array of all events
    Event**  Eq;                // sorted list of event pointers
public:
              EventQueue(Polygon P);     // constructor
             ~EventQueue(void)           // destructor
                  { delete Eq; delete Edata;}

    Event*   next();                     // next event on queue
};

// EventQueue Routines
EventQueue::EventQueue( Polygon P )
{
    ix = 0;
    ne = 2 * P.n;           // 2 vertex events for each edge
    Edata = (Event*)new Event[ne];
    Eq = (Event**)new (Event*)[ne];
    for (int i=0; i < ne; i++)           // init Eq array pointers
        Eq[i] = &Edata[i];

    // Initialize event queue with edge segment endpoints
    for (int i=0; i < P.n; i++) {        // init data for edge i
        Eq[2*i]->edge = i;
        Eq[2*i+1]->edge = i;
        Eq[2*i]->eV   = &(P.V[i]);
        Eq[2*i+1]->eV = &(P.V[i+1]);
        if (xyorder( &P.V[i], &P.V[i+1]) < 0)  { // determine type
            Eq[2*i]->type    = LEFT;
             Eq[2*i+1]->type = RIGHT;
        }
        else {
            Eq[2*i]->type    = RIGHT;
             Eq[2*i+1]->type = LEFT;
        }
    }
    // Sort Eq[] by increasing x and y
    qsort( Eq, ne, sizeof(Event*), E_compare );
}

Event* EventQueue::next()
{
    if (ix >= ne)
        return (Event*)0;
    else
        return Eq[ix++];
}
//===================================================================
 


// SweepLine Class

// SweepLine segment data struct
typedef struct _SL_segment SLseg;
struct _SL_segment {
    int      edge;          // polygon edge i is V[i] to V[i+1]
    Point    lP;            // leftmost vertex point
    Point    rP;            // rightmost vertex point
    SLseg*   above;         // segment above this one
    SLseg*   below;         // segment below this one
};

// the Sweep Line itself
class SweepLine {
    int      nv;            // number of vertices in polygon
    Polygon* Pn;            // initial Polygon
    BBT      Tree;          // balanced binary tree
public:
              SweepLine(Polygon P)            // constructor
                  { nv = P.n; Pn = &P; }
             ~SweepLine(void)                 // destructor
                  { Tree.freetree();}

    SLseg*   add( Event* );
    SLseg*   find( Event* );
    int      intersect( SLseg*, SLseg*  );
    void     remove( SLseg* );
};

SLseg* SweepLine::add( Event* E )
{
    // fill in SLseg element data
    SLseg* s = new SLseg;
    s->edge  = E->edge;

    // if it is being added, then it must be a LEFT edge event
    // but need to determine which endpoint is the left one
    Point* v1 = &(Pn->V[s->edge]);
    Point* v2 = &(Pn->V[s->edge+1]);
    if (xyorder( v1, v2) < 0) { // determine which is leftmost
        s->lP = *v1;
        s->rP = *v2;
    }
    else {
        s->rP = *v1;
        s->lP = *v2;
    }
    s->above = (SLseg*)0;
    s->below = (SLseg*)0;

    // add a node to the balanced binary tree
    Tnode* nd = Tree.insert(s);
    Tnode* nx = Tree.next(nd);
    Tnode* np = Tree.prev(nd);
    if (nx != (Tnode*)0) {
        s->above = (SLseg*)nx->val;
        s->above->below = s;
    }
    if (np != (Tnode*)0) {
        s->below = (SLseg*)np->val;
        s->below->above = s;
    }
    return s;
}

SLseg* SweepLine::find( Event* E )
{
    // need a segment to find it in the tree
    SLseg* s = new SLseg;
    s->edge  = E->edge;
    s->above = (SLseg*)0;
    s->below = (SLseg*)0;

    Tnode* nd = Tree.find(s);
    delete s;
    if (nd == (Tnode*)0)
        return (SLseg*)0;

    return (SLseg*)nd->val;
}

void SweepLine::remove( SLseg* s )
{
    // remove the node from the balanced binary tree
    Tnode* nd = Tree.find(s);
    if (nd == (Tnode*)0)
        return;       // not there

    // get the above and below segments pointing to each other
    Tnode* nx = Tree.next(nd);
    if (nx != (Tnode*)0) {
        SLseg* sx = (SLseg*)(nx->val);
        sx->below = s->below;
    }
    Tnode* np = Tree.prev(nd);
    if (np != (Tnode*)0) {
        SLseg* sp = (SLseg*)(np->val);
        sp->above = s->above;
    }
    Tree.remove(nd);       // now  can safely remove it
    delete s;
}

// test intersect of 2 segments and return: 0=none, 1=intersect
int SweepLine::intersect( SLseg* s1, SLseg* s2)
{
    if (s1 == (SLseg*)0 || s2 == (SLseg*)0)
        return FALSE;       // no intersect if either segment doesn't exist

    // check for consecutive edges in polygon
    int e1 = s1->edge;
    int e2 = s2->edge;
    if (((e1+1)%nv == e2) || (e1 == (e2+1)%nv))
        return FALSE;       // no non-simple intersect since consecutive

    // test for existence of an intersect point
    float lsign, rsign;
    lsign = isLeft(s1->lP, s1->rP, s2->lP);    //  s2 left point sign
    rsign = isLeft(s1->lP, s1->rP, s2->rP);    //  s2 right point sign
    if (lsign * rsign > 0) // s2 endpoints have same sign  relative to s1
        return FALSE;       // => on same side => no intersect is possible
    lsign = isLeft(s2->lP, s2->rP, s1->lP);    //  s1 left point sign
    rsign = isLeft(s2->lP, s2->rP, s1->rP);    //  s1 right point sign
    if (lsign * rsign > 0) // s1 endpoints have same sign  relative to s2
        return FALSE;       // => on same side => no intersect is possible
    // the segments s1 and s2 straddle each other
    return TRUE;            // => an intersect exists
}
//===================================================================
 


// simple_Polygon(): test if a Polygon is simple or not
//     Input:  Pn = a polygon with n vertices V[]
//     Return: FALSE(0) = is NOT simple
//             TRUE(1)  = IS simple
int
simple_Polygon( Polygon Pn )
{
    EventQueue  Eq(Pn);
    SweepLine   SL(Pn);
    Event*      e;                  // the current event
    SLseg*      s;                  // the current SL segment

    // This loop processes all events in the sorted queue
    // Events are only left or right vertices since
    // No new events will be added (an intersect => Done)
    while (e = Eq.next()) {         // while there are events
        if (e->type == LEFT) {      // process a left vertex
            s = SL.add(e);          // add it to the sweep line
            if (SL.intersect(  s, s->above))
                 return FALSE;      // Pn is NOT simple
            if (SL.intersect(  s, s->below))
                 return FALSE;      // Pn is NOT simple
        }
        else {                      // processs a right vertex
            s = SL.find(e);
            if (SL.intersect(  s->above, s->below))
                 return FALSE;      // Pn is NOT simple
            SL.remove(s);           // remove it from the sweep line
        }
    }
    return TRUE;      // Pn IS simple
}
//===================================================================