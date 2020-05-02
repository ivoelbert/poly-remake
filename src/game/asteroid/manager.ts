import { Vector3 } from 'three';
import { Asteroid } from './asteroid';
import { PolyScene } from '../scene/PolyScene';
import { repeat } from '../utils';
import { ASTEROIDS_IN_SCENE, MIN_RADIUS } from '../constants';

export interface Manager {
    spawn: (position: Vector3, normal: Vector3) => void;
    drop: (asteroid: Asteroid) => void;
    update: () => void;
    dispose: () => void;
}

export class AsteroidManager implements Manager {
    private idleObjects: Set<Asteroid>;
    private liveObjects: Set<Asteroid>;
    private scene: PolyScene;

    constructor() {
        this.idleObjects = new Set();
        this.liveObjects = new Set();
        this.scene = PolyScene.getInstance();

        repeat(ASTEROIDS_IN_SCENE, (_) => {
            this.idleObjects.add(new Asteroid(this.drop));
        });

        this.idleObjects.forEach((object) => this.scene.add(object.mesh));
        const initialPosition = new Vector3(0, MIN_RADIUS, 0);
        const initialNormal = new Vector3(1, 0, 0);

        this.spawn(initialPosition, initialNormal);


        // For debug only
        setInterval(() => this.spawn(initialPosition, initialNormal), 10000);
    }

    public spawn = (position: Vector3, normal: Vector3) => {
        const asteroidToSpawnIterator = this.idleObjects.values().next();
        if (!asteroidToSpawnIterator.done) {
            const asteroidToSpawn = asteroidToSpawnIterator.value;

            this.idleObjects.delete(asteroidToSpawn);
            this.liveObjects.add(asteroidToSpawn);

            asteroidToSpawn.spawn(position, normal);
        }
    };

    public drop = (asteroidToDelete: Asteroid) => {
        this.liveObjects.delete(asteroidToDelete);
        this.idleObjects.add(asteroidToDelete);
    };
    public update = () => {
        this.liveObjects.forEach((object) => object.update());
    };
    public dispose = () => {
        this.liveObjects.forEach((object) => this.scene.remove(object.mesh));
        this.idleObjects.forEach((object) => this.scene.remove(object.mesh));
    };
}
