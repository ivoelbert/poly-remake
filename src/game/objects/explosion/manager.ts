import { PolyClock } from '../../clock/PolyClock';
import { EXPLOSIONS_IN_SCENE } from '../../constants';
import { PolyScene } from '../../scene/PolyScene';
import { assertExists, getDumpster, getOne, repeat } from '../../utils/utils';
import { Manager } from '../manager';
import { Explosion } from './explosion';
import { ExplosionMeshFactory } from './meshFactory';

export class ExplosionsManager implements Manager<Explosion> {
    private idleObjects: Set<Explosion>;
    private liveObjects: Set<Explosion>;

    constructor(private scene: PolyScene, private clock: PolyClock) {
        this.idleObjects = new Set();
        this.liveObjects = new Set();

        const meshFactory = new ExplosionMeshFactory();
        repeat(EXPLOSIONS_IN_SCENE, (_) => {
            const object = new Explosion(meshFactory, this.clock, this.drop);
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
    };

    public drop = (objectToDelete: Explosion) => {
        objectToDelete.mesh.position.copy(getDumpster());
        this.liveObjects.delete(objectToDelete);
        this.idleObjects.add(objectToDelete);
    };

    public update = () => {
        this.liveObjects.forEach((object) => object.update());
    };

    public dispose = () => {
        this.liveObjects.forEach((object) => this.scene.remove(object.mesh));
        this.idleObjects.forEach((object) => this.scene.remove(object.mesh));
    };
}
