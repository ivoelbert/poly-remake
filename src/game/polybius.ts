import * as THREE from 'three';
import { Stars } from './objects/stars';
import { consoleInfo } from './utils';
import { Center } from './objects/center';
import { CENTER_RADIUS } from './constants';

export class Polybius {
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;

    constructor() {
        // Set up the renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Set up the scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x000000, 0.000025);

        // Set up an ambient light
        const light = new THREE.AmbientLight(0xffffff);
        this.scene.add(light);

        // Set camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, CENTER_RADIUS * 2);
        this.camera.lookAt(0, 0, 0);

        this.init();
    }

    public resize = (): void => {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    };

    public getDomElement = (): HTMLCanvasElement => {
        return this.renderer.domElement;
    };

    private init = (): void => {
        const stars = new Stars();
        this.scene.add(stars.mesh);

        const center = new Center();
        this.scene.add(center.mesh);

        // Start the render loop!
        consoleInfo('Game started!');
        this.animate();
    };

    private animate = (): void => {
        requestAnimationFrame(this.animate);

        this.renderer.render(this.scene, this.camera);
    };
}
