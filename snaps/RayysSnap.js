class RayysSnap {
    constructor(rayysMiscHelpers, threshold) {
        this.rayysMiscHelpers = rayysMiscHelpers;
        this.threshold = threshold;

        // which snap actors you want to use?
        this.actors = [ 
            new RayysPointSnapActor(0.2),
            new RayysLineSnapActor(0.2),
            new RayysPlaneSnapActor(0.2, true)
        ];

        // which objects you want to snap to each other?
        this.objects = [ ];
        // this is a collection of id => targets, where as id is scene object id, and targets are this object's targets
        this.targets = { };
        this.targetNodes = { };

        // which snap factory should be used to generate targets?
        this.factory = new BBoxSnapFactory();
    }

    add(obj) {
        this.objects.push( obj );
        var targets = this.factory.create(obj, true, true, true, true, true, true) ;
        this.targets[ obj.id ] = targets;

        let node = targets.getNode();
        this.targetNodes [ obj.id ] = node;
        return node;
    }

    update(obj) {
        this.factory.update(obj, this.targets[ obj.id ], true, true, true, true, true, true) ;
        let node = this.targets[ obj.id ].getNode();
        this.targetNodes [ obj.id ] = node;
        return node;
    }

    getTargets(obj) {
        return this.targets [ obj.id ];
    }

    getTargetsNode(obj) {
        return this.targetNodes [ obj.id ];
    }

    // this will return snapped object position for the object being manipulated and raw object position
    snap(obj, previewPos) {

        let objTargets = this.targets[ obj.id ];

        let previewOffset = previewPos.clone().sub(obj.position);
        let snapInfo = {
            point: {
                snapped: { x: false, y: false, z: false },
                offset: undefined
            },
            line: {
                snapped: { x: false, y: false, z: false },
                offset: undefined
            },
            plane: {
                snapped: { x: false, y: false, z: false },
                offset: undefined
            }
        };

        for (let actorId in this.actors) {
            let activeActor = this.actors[ actorId ]; // select snap actor

            for (let targetId in this.targets) {
                if (targetId == obj.id) continue; //skip self

                let other = this.targets[ targetId ];
                // check that picked object's targets snap to one or many of other existing targets
                let snapOffs = objTargets.snap(previewOffset, other, activeActor);

                if (snapOffs) {
                    if (snapInfo[activeActor.type].offset === undefined) {
                        snapInfo[activeActor.type].offset = snapOffs;
                        snapInfo[activeActor.type].snapped.x = !RayysMiscHelpers.isZero(snapOffs.x, 1e-6);
                        snapInfo[activeActor.type].snapped.y = !RayysMiscHelpers.isZero(snapOffs.y, 1e-6);
                        snapInfo[activeActor.type].snapped.z = !RayysMiscHelpers.isZero(snapOffs.z, 1e-6);
                    } else {
                        // snap offset may accumulate, when you snap to the numerous matching targets
                        if (!RayysMiscHelpers.isZero(snapOffs.x, 1e-6) && !snapInfo[activeActor.type].snapped.x) {
                            snapInfo[activeActor.type].offset.x += snapOffs.x;
                            snapInfo[activeActor.type].snapped.x = true;
                        }
                        if (!RayysMiscHelpers.isZero(snapOffs.y, 1e-6) && !snapInfo[activeActor.type].snapped.y) {
                            snapInfo[activeActor.type].offset.y += snapOffs.y;
                            snapInfo[activeActor.type].snapped.y = true;
                        }
                        if (!RayysMiscHelpers.isZero(snapOffs.z, 1e-6) && !snapInfo[activeActor.type].snapped.z) {
                            snapInfo[activeActor.type].offset.z += snapOffs.z;
                            snapInfo[activeActor.type].snapped.z = true;
                        }
                    }
                }
            }
        }

        // now see priority, point will override all other snaps
        if (snapInfo["point"].offset) {
            return previewPos.clone().add(snapInfo["point"].offset);
        }

        // line snap will override plane snap
        if (snapInfo["line"].offset) {
            return previewPos.clone().add(snapInfo["line"].offset);
        }

        // plane snap is least restrictive, goes the last
        if (snapInfo["plane"].offset) {
            return previewPos.clone().add(snapInfo["plane"].offset);
        }

        return undefined;
    }
}
