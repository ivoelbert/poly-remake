import * as THREE from 'three';
import { PolyObject } from '../polyObject';
import { Vector3 } from 'three';
import { PolyClock } from '../../clock/PolyClock';
import { tooFarFromCenter } from '../../utils';
import { DropFunction } from '../manager';
import { AsteroidMeshFactory } from './meshFactory';
import { PolyHitbox } from '../hitbox';

export class Asteroid implements PolyObject {
    public mesh: THREE.Object3D;
    public hitbox: PolyHitbox;

    private normal: Vector3;
    private drop: () => void;
    private angularVelocity: number;
    private radialVelocity: number;
    private clock: PolyClock;

    constructor(meshFactory: AsteroidMeshFactory, drop: DropFunction<Asteroid>) {
        this.mesh = meshFactory.buildMesh();
        this.hitbox = new PolyHitbox(this.mesh, meshFactory.getHitboxGeometry());

        this.normal = new Vector3(0, 1, 0);

        this.angularVelocity = 1;
        this.radialVelocity = 1;
        this.clock = PolyClock.getInstance();
        this.drop = () => drop(this);
    }

    public spawn = (position: Vector3, normal: Vector3): void => {
        this.mesh.position.copy(position);
        this.normal = normal;
    };

    public onCollide = (who: PolyObject): void => {
        this.drop();
    };

    public update = (): void => {
        const { delta } = this.clock;
        // Rotation
        const angleToRotate = this.angularVelocity * delta;
        this.mesh.position.applyAxisAngle(this.normal, angleToRotate);

        // radial movement
        const currentLength = this.mesh.position.length();
        const lengthOffset = this.radialVelocity * delta;
        this.mesh.position.setLength(currentLength + lengthOffset);

        this.hitbox.update();

        if (tooFarFromCenter(this.mesh.position)) {
            this.drop();
        }
    };
}
