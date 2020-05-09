import { Vector3 } from 'three';
import { FollowMissile } from './followMissile';
import { repeat, getDumpster, randomUnitVector, getOrigin } from '../../utils';
import { MISSILES_IN_SCENE } from '../../constants';
import { Manager } from '../manager';
import { MissileMeshFactory } from './meshFactory';
import { FollowMissileDispenser } from './followMissileDispenser';

export class FollowMissileManager implements Manager<FollowMissile> {
    private missileDispenser: FollowMissileDispenser;
    private meshFactory: MissileMeshFactory;

    constructor(followedObject: THREE.Object3D) {
        this.meshFactory = new MissileMeshFactory();
        this.missileDispenser = new FollowMissileDispenser();

        console.log(this.missileDispenser);

        repeat(MISSILES_IN_SCENE, (_) => {
            const object = new FollowMissile(followedObject, this.meshFactory, this.drop);
            object.mesh.position.copy(getDumpster());
            this.missileDispenser.addObject(object);
        });

        // For debug only
        const initialPosition = getOrigin();
        this.spawn(initialPosition, randomUnitVector());
        setInterval(() => this.spawn(initialPosition, randomUnitVector()), 10000);
    }

    public spawn = (position: Vector3, direction: Vector3) => {
        // If no available objects blow up. In the future we should do better.
        // A FIFO structure that drops the oldest element and spawns the new one.
        const objectToSpawn = this.missileDispenser.getOne();

        objectToSpawn.spawn(position, direction);
    };

    public drop = this.missileDispenser.dropOne;

    public update = this.missileDispenser.update;

    public dispose = this.missileDispenser.dispose;
}
