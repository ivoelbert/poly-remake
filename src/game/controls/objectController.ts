import * as THREE from 'three';
import { PolyControls, Movements, MoveState, getIdleMoveState, lerpMoveStates } from './polyControls';
import { PolyClock } from '../clock/PolyClock';
import { MAX_RADIUS, MIN_RADIUS } from '../constants';

/**
 * Transforms an object based on the supplied controls
 */
const MOVEMENT_EPSILON = 0.00001;
export class ObjectController {
    private clock: PolyClock;
    private moveState: MoveState;

    private orbitSpeed: number;
    private rollSpeed: number;
    private depthSpeed: number;
    private inertiaFactor: number;

    private matrix: THREE.Matrix4;
    private position: THREE.Vector3;
    private objectRadius: number;

    constructor(private controls: PolyControls, private object: THREE.Object3D) {
        this.clock = PolyClock.getInstance();
        this.moveState = getIdleMoveState();

        this.orbitSpeed = 1.5;
        this.rollSpeed = 1.5;
        this.depthSpeed = 10;
        this.inertiaFactor = 0.05;

        this.matrix = new THREE.Matrix4();
        this.position = this.object.position.clone();
        this.objectRadius = MAX_RADIUS;

        this.update();
    }

    public update = (): void => {
        const delta = this.clock.delta;

        // Movement inertia
        this.moveState = lerpMoveStates(this.moveState, this.controls.moveState, this.inertiaFactor);

        // Forwards/backwards
        const depthMovement = this.moveState[Movements.backwards] - this.moveState[Movements.forwards];
        if (Math.abs(depthMovement) > MOVEMENT_EPSILON) {
            const zOffset = depthMovement * this.depthSpeed * delta;

            if (this.objectRadius + zOffset < MIN_RADIUS) {
                this.objectRadius = MIN_RADIUS;
            } else if (this.objectRadius + zOffset > MAX_RADIUS) {
                this.objectRadius = MAX_RADIUS;
            } else {
                this.objectRadius += zOffset;
            }
        }

        // Orbit and roll. Dark linear algebra magic happening here.
        const verticalOrbit = this.moveState[Movements.up] - this.moveState[Movements.down];
        const horizontalOrbit = this.moveState[Movements.right] - this.moveState[Movements.left];
        const roll = this.moveState[Movements.rollRight] - this.moveState[Movements.rollLeft];

        const xrot = verticalOrbit * this.orbitSpeed * delta;
        const yrot = horizontalOrbit * this.orbitSpeed* delta;
        const zrot = roll * this.rollSpeed * delta;

        const xAxis = new THREE.Vector3();
        const yAxis = new THREE.Vector3();
        const zAxis = new THREE.Vector3();
        this.matrix.extractBasis(xAxis, yAxis, zAxis);

        const rxmatrix = new THREE.Matrix4().makeRotationAxis(xAxis, xrot);
        const rymatrix = new THREE.Matrix4().makeRotationAxis(yAxis, yrot);
        const rzmatrix = new THREE.Matrix4().makeRotationAxis(zAxis, zrot);

        this.matrix.premultiply(rxmatrix);
        this.matrix.premultiply(rymatrix);
        this.matrix.premultiply(rzmatrix);

        const pos = new THREE.Vector3(0, 0, -1).applyMatrix4(this.matrix);
        pos.multiplyScalar(this.objectRadius);
        this.position.copy(pos);

        // Update the actual object
        this.object.position.copy(this.position);

        // Very important: Make the object look at the center and update its up vector
        const upvec = new THREE.Vector3(0, 1, 0);
        upvec.applyMatrix4(this.matrix);
        this.object.up.copy(upvec);
        this.object.lookAt(new THREE.Vector3(0, 0, 0));
    };
}
