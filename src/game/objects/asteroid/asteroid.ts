import * as THREE from 'three';
import { PolyObject } from '../polyObject';
import { Vector3 } from 'three';
import { PolyClock } from '../../clock/PolyClock';
import { tooFarFromCenter } from '../../utils';
import { DropFunction } from '../manager';

export class Asteroid implements PolyObject {
    public mesh: THREE.Object3D;
    private normal: Vector3;
    private drop: () => void;
    private angularVelocity: number;
    private radialVelocity: number;
    private clock: PolyClock;

    constructor(dropAsteroid: DropFunction<Asteroid>) {
        const geometry = new THREE.DodecahedronBufferGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 0x2bfa2b,
            wireframe: true,
        });

        this.normal = new Vector3(0, 1, 0);
        this.mesh = new THREE.Mesh(geometry, material);

        this.angularVelocity = 1;
        this.radialVelocity = 1;
        this.clock = PolyClock.getInstance();
        this.drop = () => dropAsteroid(this);
    }

    public spawn = (position: Vector3, normal: Vector3): void => {
        this.mesh.position.set(position.x, position.y, position.z);
        this.normal = normal;
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

        if (tooFarFromCenter(this.mesh.position)) {
            this.drop();
        }
    };
}
