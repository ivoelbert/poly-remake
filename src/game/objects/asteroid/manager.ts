import { Vector3 } from 'three';
import { Asteroid } from './asteroid';
import { PolyScene } from '../../scene/PolyScene';
import {
    repeat,
    getDumpster,
    randomUnitVector,
    assertExists,
    getOne,
    randomOrthogonalUnitVector,
} from '../../utils/utils';
import { ASTEROIDS_IN_SCENE, CENTER_RADIUS } from '../../constants';
import { Manager } from '../manager';
import { AsteroidMeshFactory } from './meshFactory';
import { PolyCollider, Groups } from '../../collider';
import { PolyClock } from '../../clock/PolyClock';
import { ExplosionsManager } from '../explosion/manager';

export class AsteroidManager implements Manager<Asteroid> {
    private idleObjects: Set<Asteroid>;
    private liveObjects: Set<Asteroid>;
    private intervalId: NodeJS.Timeout | null;

    constructor(
        private scene: PolyScene,
        private collider: PolyCollider,
        private clock: PolyClock,
        private explosions: ExplosionsManager
    ) {
        this.idleObjects = new Set();
        this.liveObjects = new Set();

        const meshFactory = new AsteroidMeshFactory();
        repeat(ASTEROIDS_IN_SCENE, (_) => {
            const object = new Asteroid(meshFactory, this.clock, this.explosions, this.drop);
            object.mesh.position.copy(getDumpster());
            this.idleObjects.add(object);
        });

        this.idleObjects.forEach((object) => this.scene.add(object.mesh));
        this.intervalId = null;
    }

    public start = () => {
        this.intervalId = setInterval(this.spawnRandom, 3000);
    };

    public spawn = (position: Vector3, normal: Vector3) => {
        // If no available objects blow up. In the future we should do better.
        // A FIFO structure that drops the oldest element and spawns the new one.
        const objectToSpawn = assertExists(getOne(this.idleObjects));

        this.idleObjects.delete(objectToSpawn);
        this.liveObjects.add(objectToSpawn);

        objectToSpawn.spawn(position, normal);

        this.collider.addObjectToGroup(objectToSpawn, Groups.asteroids);
    };

    public drop = (objectToDelete: Asteroid) => {
        objectToDelete.mesh.position.copy(getDumpster());
        this.liveObjects.delete(objectToDelete);
        this.idleObjects.add(objectToDelete);

        this.collider.removeObjectFromGroup(objectToDelete, Groups.asteroids);
    };

    public update = () => {
        this.liveObjects.forEach((object) => object.update());
    };

    public dispose = () => {
        this.liveObjects.forEach((object) => this.scene.remove(object.mesh));
        this.idleObjects.forEach((object) => this.scene.remove(object.mesh));

        if (this.intervalId !== null) {
            clearTimeout(this.intervalId);
        }
    };

    private spawnRandom = (): void => {
        const normal = randomUnitVector();
        const position = randomOrthogonalUnitVector(normal).setLength(CENTER_RADIUS);

        this.spawn(position, normal);
    };
}
