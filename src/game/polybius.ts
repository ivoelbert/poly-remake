import { Stars } from './objects/stars';
import { consoleInfo } from './utils';
import { Center } from './objects/center';
import { KeyboardControls } from './controls/keyboardControls';
import { PolyClock } from './clock/PolyClock';
import { ObjectController } from './controls/objectController';
import { PolyShip } from './objects/ship';
import { FollowCamera } from './objects/followCamera';
import { PolyRenderer } from './renderer';
import { PolyScene } from './scene/PolyScene';
import { AsteroidManager } from './asteroid/manager';
import { FollowMissile } from './objects/followMissile';

export class Polybius {
    private renderer: PolyRenderer;
    private clock: PolyClock;
    private camera: FollowCamera;
    private controls: KeyboardControls;
    private objectController: ObjectController;
    private ship: PolyShip;
    private scene: PolyScene;
    private asteroids: AsteroidManager;
    private missile: FollowMissile;

    constructor() {
        // Set up the scene
        this.scene = PolyScene.getInstance();
        // Set up the clock
        this.clock = PolyClock.getInstance();

        // Set up the ship
        this.ship = new PolyShip();

        // Set up camera
        this.camera = new FollowCamera(this.ship.mesh);

        // Set up the renderer
        this.renderer = new PolyRenderer(this.scene.scene, this.camera);
        this.renderer.resize();

        const stars = new Stars();

        const center = new Center();

        this.scene.add(this.ship.mesh, stars.mesh, center.mesh);

        this.missile = new FollowMissile(this.ship.mesh);
        this.scene.add(this.missile.mesh);

        this.controls = new KeyboardControls();
        this.objectController = new ObjectController(this.controls, this.ship.mesh);

        this.asteroids = new AsteroidManager();

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
        this.missile.update();

        this.asteroids.update();

        this.renderer.render();
    };
}
