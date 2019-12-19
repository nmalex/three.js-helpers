import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class Demo {
    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        
        this.camera.position.set(10,10,10);
        
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
        });
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setClearColor(new THREE.Color(0xfefefe));
        this.renderer.setPixelRatio(window.devicePixelRatio);

        document.body.appendChild( this.renderer.domElement );
        
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.10;
        this.controls.screenSpacePanning = false;
    }

    run(demo) {
        // init demo
        demo.init(this);

        var animate;
        animate = function() {
            requestAnimationFrame( animate );
            this.controls.update();

            // let demo update on each animation frame
            if (demo.update) {
                demo.update(this);
            }

            this.renderer.render( this.scene, this.camera );
        }.bind(this);
        animate();
    }

    static run(demo) {
        const instance = new Demo();
        instance.init();
        instance.run(demo);
    }
}
