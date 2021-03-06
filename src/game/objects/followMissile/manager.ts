import { Vector3 } from 'three';
import { FollowMissile } from './followMissile';
import { PolyScene } from '../../scene/PolyScene';
import {
    repeat,
    getDumpster,
    getOne,
    assertExists,
    randomUnitVector,
    getOrigin,
} from '../../utils/utils';
import { MISSILES_IN_SCENE } from '../../constants';
import { Manager } from '../manager';
import { MissileMeshFactory } from './meshFactory';
import { PolyCollider, Groups } from '../../collider';
import { PolyClock } from '../../clock/PolyClock';
import { ExplosionsManager } from '../explosion/manager';

export class FollowMissileManager implements Manager<FollowMissile> {
    private idleObjects: Set<FollowMissile>;
    private liveObjects: Set<FollowMissile>;
    private intervalId: NodeJS.Timeout | null;

    constructor(
        private scene: PolyScene,
        followedObject: THREE.Object3D,
        private clock: PolyClock,
        private collider: PolyCollider,
        explosions: ExplosionsManager
    ) {
        this.idleObjects = new Set();
        this.liveObjects = new Set();
        const meshFactory = new MissileMeshFactory();

        repeat(MISSILES_IN_SCENE, (_) => {
            const object = new FollowMissile(
                followedObject,
                this.clock,
                explosions,
                meshFactory,
                this.drop
            );
            object.mesh.position.copy(getDumpster());
            this.idleObjects.add(object);
        });

        this.idleObjects.forEach((object) => this.scene.add(object.mesh));
        this.intervalId = null;
    }

    public start = () => {
        const initialPosition = getOrigin();
        this.spawn(initialPosition, randomUnitVector());
        this.intervalId = setInterval(() => this.spawn(initialPosition, randomUnitVector()), 10000);
    };

    public spawn = (position: Vector3, direction: Vector3) => {
        // If no available objects blow up. In the future we should do better.
        // A FIFO structure that drops the oldest element and spawns the new one.
        const objectToSpawn = assertExists(getOne(this.idleObjects));

        this.idleObjects.delete(objectToSpawn);
        this.liveObjects.add(objectToSpawn);

        objectToSpawn.spawn(position, direction);

        this.collider.addObjectToGroup(objectToSpawn, Groups.missiles);
    };

    public drop = (objectToDelete: FollowMissile) => {
        objectToDelete.mesh.position.copy(getDumpster());
        this.liveObjects.delete(objectToDelete);
        this.idleObjects.add(objectToDelete);

        this.collider.removeObjectFromGroup(objectToDelete, Groups.missiles);
    };

    public update = () => {
        this.liveObjects.forEach((object) => object.update());
    };

    public dispose = () => {
        this.liveObjects.forEach((object) => this.scene.remove(object.mesh));
        this.idleObjects.forEach((object) => this.scene.remove(object.mesh));

        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
        }
    };
}
