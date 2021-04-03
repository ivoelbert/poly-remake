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
import { ExplosionsManager } from './objects/explosion/manager';

export class Polybius {
    private renderer: PolyRenderer;
    private clock: PolyClock;
    private camera: FollowCamera;
    private keyboardControls: KeyboardControls;
    private objectController: ObjectController;
    private center: Center;
    private ship: PolyShip;
    private scene: PolyScene;
    private explosions: ExplosionsManager;
    private asteroids: AsteroidManager;
    private missiles: FollowMissileManager;
    private shots: ShotManager;
    private collider: PolyCollider;

    constructor() {
        // Set up the scene
        this.scene = new PolyScene();

        // Set up the clock
        this.clock = new PolyClock();

        // Set up the collider
        this.collider = new PolyCollider();
        this.collider.addRule(Groups.asteroids, Groups.ship);
        this.collider.addRule(Groups.shots, Groups.asteroids);
        this.collider.addRule(Groups.shots, Groups.center);
        this.collider.addRule(Groups.shots, Groups.missiles);
        this.collider.addRule(Groups.missiles, Groups.ship);

        this.explosions = new ExplosionsManager(this.scene, this.clock);

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
        this.center = new Center(this.clock);
        this.collider.addObjectToGroup(this.center, Groups.center);

        this.scene.add(this.ship.mesh, stars.mesh, this.center.mesh);

        this.asteroids = new AsteroidManager(
            this.scene,
            this.collider,
            this.clock,
            this.explosions
        );
        this.missiles = new FollowMissileManager(
            this.scene,
            this.ship.mesh,
            this.clock,
            this.collider,
            this.explosions
        );
        this.shots = new ShotManager(this.scene, this.collider, this.clock);

        /**
         * TODO: iron out the orientation controls and figure out what controls to use
         * or provide a way to use both.
         */
        this.keyboardControls = new KeyboardControls();
        this.objectController = new ObjectController(
            this.keyboardControls,
            this.ship.mesh,
            this.shots,
            this.clock
        );
    }

    public start = (): void => {
        this.keyboardControls.attachListeners();
        window.addEventListener('resize', this.resize);

        this.asteroids.start();
        this.missiles.start();

        // Start the render loop!
        consoleInfo('Game started!');
        this.animate();
    };

    public dispose = (): void => {
        this.keyboardControls.dispose();
        this.asteroids.dispose();
        this.missiles.dispose();
        this.explosions.dispose();

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
        this.clock.tick();

        this.objectController.update();
        this.ship.update();
        this.center.update();

        this.missiles.update();
        this.asteroids.update();
        this.shots.update();
        this.explosions.update();

        this.collider.update();

        this.camera.update();
        this.renderer.render();
        requestAnimationFrame(this.animate);
    };
}
