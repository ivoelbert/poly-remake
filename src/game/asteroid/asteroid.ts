import * as THREE from 'three';
import { PolyObject } from '../objects/polyObject';
import { TOO_FAR_TO_CARE } from '../constants';
import { Vector3 } from 'three';
import { PolyClock } from '../clock/PolyClock';

export class Asteroid implements PolyObject {
    public mesh: THREE.Object3D;
    private normal: Vector3;
    private drop: (asteroid: Asteroid) => void;
    private angularVelocity: number;
    private radialVelocity: number;
    private clock: PolyClock;

    constructor(dropAsteroid: (Asteroid: Asteroid) => void) {
        const geometry = new THREE.DodecahedronBufferGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 0x2bfa2b,
            wireframe: true,
        });

        this.normal = new Vector3(0, 1, 0);
        this.mesh = new THREE.Mesh(geometry, material);
        
        const initialPosition = new Vector3(
            TOO_FAR_TO_CARE,
            TOO_FAR_TO_CARE,
            TOO_FAR_TO_CARE
        );
        
        this.mesh.position.set(initialPosition.x, initialPosition.y, initialPosition.z)

        this.angularVelocity = 1;
        this.radialVelocity = 1;
        this.drop = dropAsteroid;
        this.clock = PolyClock.getInstance();
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

        if(this.mesh.position.length() > TOO_FAR_TO_CARE){
            this.mesh.position.set(TOO_FAR_TO_CARE, TOO_FAR_TO_CARE, TOO_FAR_TO_CARE)
            this.drop(this)
        }
    };
}
