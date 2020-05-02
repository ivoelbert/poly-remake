import * as THREE from 'three';
import { Stars } from './objects/stars';
import { consoleInfo } from './utils';
import { Center } from './objects/center';
import { KeyboardControls } from './controls/keyboardControls';
import { PolyClock } from './clock/PolyClock';
import { ObjectController } from './controls/objectController';
import { PolyShip } from './objects/ship';
import { FollowCamera } from './objects/followCamera';
import { PolyRenderer } from './renderer';

export class Polybius {
    private renderer: PolyRenderer;
    private scene: THREE.Scene;
    private clock: PolyClock;
    private camera: FollowCamera;
    private controls: KeyboardControls;
    private objectController: ObjectController;
    private ship: PolyShip;

    constructor() {
        // Set up the scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x000000, 0.000025);

        // Set up the clock
        this.clock = PolyClock.getInstance();

        // Set up the ship
        this.ship = new PolyShip();
        this.scene.add(this.ship.mesh);

        // Set up camera
        this.camera = new FollowCamera(this.ship.mesh);

        // Set up the renderer
        this.renderer = new PolyRenderer(this.scene, this.camera);
        this.renderer.resize();

        // Some ambient light
        const light = new THREE.AmbientLight(0xffffff);
        this.scene.add(light);

        const stars = new Stars();
        this.scene.add(stars.mesh);

        const center = new Center();
        this.scene.add(center.mesh);

        this.controls = new KeyboardControls();
        this.objectController = new ObjectController(this.controls, this.ship.mesh);

        // Start the render loop!
        consoleInfo('Game started!');
        this.animate();
    }

    public attachListeners = (): void => {
        this.controls.attachListeners();
        window.addEventListener('resize', this.resize);
    };

    public dispose = (): void => {
        this.controls.dispose();
        window.removeEventListener('resize', this.resize);
    };

    public getDomElement = (): HTMLCanvasElement => {
        return this.renderer.getDomElement();
    };

    private resize = (): void => {
        this.renderer.resize();
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    };

    // This function represents a frame. It's called once for every frame.
    private animate = (): void => {
        requestAnimationFrame(this.animate);
        this.clock.tick();

        this.objectController.update();
        this.camera.update();

        this.renderer.render();
    };
}
