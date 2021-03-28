import { Stars } from './objects/stars/stars';
import { consoleInfo } from './utils/utils';
import { Center } from './objects/center';
import { KeyboardControls } from './controls/keyboardControls';
import { PolyClock } from './clock/PolyClock';
import { ObjectController } from './controls/objectController';
import { PolyShip } from './objects/ship/ship';
import { FollowCamera } from './objects/followCamera';
import { PolyRenderer } from './renderer';
import { PolyScene } from './scene/PolyScene';
import { AsteroidManager } from './objects/asteroid/manager';
import { FollowMissileManager } from './objects/followMissile/manager';
import { ShotManager } from './objects/shots/manager';
import { PolyCollider, Groups } from './collider';

export class Polybius {
    private renderer: PolyRenderer;
    private clock: PolyClock;
    private camera: FollowCamera;
    private controls: KeyboardControls;
    private objectController: ObjectController;
    private ship: PolyShip;
    private scene: PolyScene;
    private asteroids: AsteroidManager;
    private missiles: FollowMissileManager;
    private shots: ShotManager;
    private collider: PolyCollider;

    constructor() {
        // Set up the scene
        this.scene = PolyScene.getInstance();

        // Set up the clock
        this.clock = new PolyClock();

        // Set up the collider
        this.collider = new PolyCollider();
        this.collider.addRule(Groups.asteroids, Groups.ship);
        this.collider.addRule(Groups.shots, Groups.asteroids);
        this.collider.addRule(Groups.shots, Groups.center);
        this.collider.addRule(Groups.shots, Groups.missiles);
        this.collider.addRule(Groups.missiles, Groups.ship);

        // Set up the ship
        this.ship = new PolyShip();
        this.collider.addObjectToGroup(this.ship, Groups.ship);

        // Set up camera
        this.camera = new FollowCamera(this.ship.mesh);

        // Set up the renderer
        this.renderer = new PolyRenderer(this.scene.scene, this.camera);
        this.renderer.resize();

        // Set up various objects and managers
        const stars = new Stars();
        const center = new Center();
        this.collider.addObjectToGroup(center, Groups.center);

        this.scene.add(this.ship.mesh, stars.mesh, center.mesh);

        this.asteroids = new AsteroidManager(this.collider, this.clock);
        this.missiles = new FollowMissileManager(this.ship.mesh, this.clock, this.collider);
        this.shots = new ShotManager(this.collider, this.clock);

        this.controls = new KeyboardControls();
        this.objectController = new ObjectController(
            this.controls,
            this.ship.mesh,
            this.shots,
            this.clock
        );

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
        this.asteroids.dispose();
        this.missiles.dispose();
        this.scene.dispose();
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
        this.ship.update();

        this.missiles.update();
        this.asteroids.update();
        this.shots.update();

        this.collider.update();

        this.camera.update();
        this.renderer.render();
    };
}
