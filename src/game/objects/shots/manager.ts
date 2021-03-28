import { Vector3 } from 'three';
import { Shot } from './shot';
import { PolyScene } from '../../scene/PolyScene';
import { repeat, getDumpster, getOne, assertExists } from '../../utils/utils';
import { SHOTS_IN_SCENE } from '../../constants';
import { Manager } from '../manager';
import { ShotMeshFactory } from './meshFactory';
import { PolyCollider, Groups } from '../../collider';
import { PolyClock } from '../../clock/PolyClock';

export class ShotManager implements Manager<Shot> {
    private idleObjects: Set<Shot>;
    private liveObjects: Set<Shot>;
    private scene: PolyScene;
    private meshFactory: ShotMeshFactory;

    constructor(private collider: PolyCollider, private clock: PolyClock) {
        this.idleObjects = new Set();
        this.liveObjects = new Set();
        this.scene = PolyScene.getInstance();
        this.meshFactory = new ShotMeshFactory();

        repeat(SHOTS_IN_SCENE, (_) => {
            const object = new Shot(this.meshFactory, this.clock, this.drop);
            object.mesh.position.copy(getDumpster());
            this.idleObjects.add(object);
        });

        this.idleObjects.forEach((object) => this.scene.add(object.mesh));
    }

    public spawn = (position: Vector3) => {
        // If no available objects blow up. In the future we should do better.
        // A FIFO structure that drops the oldest element and spawns the new one.
        const objectToSpawn = assertExists(getOne(this.idleObjects));

        this.idleObjects.delete(objectToSpawn);
        this.liveObjects.add(objectToSpawn);

        objectToSpawn.spawn(position);

        this.collider.addObjectToGroup(objectToSpawn, Groups.shots);
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
