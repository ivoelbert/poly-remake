import * as THREE from 'three';
import { Shot } from './shot';
import { PolyScene } from '../../scene/PolyScene';
import { repeat, getDumpster, getOne, assertExists } from '../../utils/utils';
import { SHOTS_IN_SCENE } from '../../constants';
import { Manager } from '../manager';
import { ShotMeshFactory } from './meshFactory';
import { PolyCollider, Groups } from '../../collider';
import { PolyClock } from '../../clock/PolyClock';
import { SoundManager } from '../../soundManager';

export class ShotManager implements Manager<Shot> {
    private idleObjects: Set<Shot>;
    private liveObjects: Set<Shot>;

    constructor(
        private scene: PolyScene,
        private collider: PolyCollider,
        private clock: PolyClock,
        private sounds: SoundManager
    ) {
        this.idleObjects = new Set();
        this.liveObjects = new Set();

        const meshFactory = new ShotMeshFactory();
        repeat(SHOTS_IN_SCENE, (_) => {
            const object = new Shot(meshFactory, this.clock, this.drop);
            object.mesh.position.copy(getDumpster());
            this.idleObjects.add(object);
        });

        this.idleObjects.forEach((object) => this.scene.add(object.mesh));
    }

    public spawn = (position: THREE.Vector3) => {
        // If no available objects blow up. In the future we should do better.
        // A FIFO structure that drops the oldest element and spawns the new one.
        const objectToSpawn = assertExists(getOne(this.idleObjects));

        this.idleObjects.delete(objectToSpawn);
        this.liveObjects.add(objectToSpawn);

        objectToSpawn.spawn(position);

        this.collider.addObjectToGroup(objectToSpawn, Groups.shots);

        this.sounds.playShot();
    };

    public drop = (objectToDelete: Shot) => {
        objectToDelete.mesh.position.copy(getDumpster());
        this.liveObjects.delete(objectToDelete);
        this.idleObjects.add(objectToDelete);

        this.collider.removeObjectFromGroup(objectToDelete, Groups.shots);
    };

    public update = () => {
        this.liveObjects.forEach((object) => object.update());
    };

    public dispose = () => {
        this.liveObjects.forEach((object) => this.scene.remove(object.mesh));
        this.idleObjects.forEach((object) => this.scene.remove(object.mesh));
    };
}
