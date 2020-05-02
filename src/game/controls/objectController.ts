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
    private forwardsAndBackwardsSpeed: number;
    private inertiaFactor: number;

    constructor(private controls: PolyControls, private object: THREE.Object3D) {
        this.clock = PolyClock.getInstance();
        this.moveState = getIdleMoveState();

        this.orbitSpeed = 0.05;
        this.rollSpeed = 0.05;
        this.forwardsAndBackwardsSpeed = 0.5;
        this.inertiaFactor = 0.1;

        this.update();
    }

    // TODO: Make movement (and probably followCamera) frame independent
    // See https://github.com/ivoelbert/poly-remake/ssues/2
    public update = (): void => {
        // Movement inertia
        this.moveState = lerpMoveStates(this.moveState, this.controls.moveState, this.inertiaFactor);

        // Forwards/backwards
        const depthMovement = this.moveState[Movements.backwards] - this.moveState[Movements.forwards];
        if (Math.abs(depthMovement) > MOVEMENT_EPSILON) {
            const zOffset = depthMovement * this.forwardsAndBackwardsSpeed;

            let objectRadius = this.object.position.length();

            if (objectRadius + zOffset < MIN_RADIUS) {
                objectRadius = MIN_RADIUS;
            } else if (objectRadius + zOffset > MAX_RADIUS) {
                objectRadius = MAX_RADIUS;
            } else {
                objectRadius += zOffset;
            }

            this.object.position.setLength(objectRadius);
        }

        // Orbit and Roll
        const xAxis = new THREE.Vector3();
        const yAxis = new THREE.Vector3();
        const zAxis = new THREE.Vector3();
        this.object.matrix.extractBasis(xAxis, yAxis, zAxis);

        const verticalOrbit = this.moveState[Movements.up] - this.moveState[Movements.down];
        const horizontalOrbit = this.moveState[Movements.right] - this.moveState[Movements.left];

        const verticalVector = xAxis.clone();
        verticalVector.multiplyScalar(verticalOrbit);
        const horizontalVector = yAxis.clone();
        horizontalVector.multiplyScalar(horizontalOrbit);

        const directionVector = new THREE.Vector3().addVectors(verticalVector, horizontalVector).clampLength(0, 1);
        const rotationAngle = directionVector.length();

        if (rotationAngle > MOVEMENT_EPSILON) {
            directionVector.normalize();
            this.object.position.applyAxisAngle(directionVector, rotationAngle * this.orbitSpeed);
        }

        const roll = this.moveState[Movements.rollRight] - this.moveState[Movements.rollLeft];
        yAxis.applyAxisAngle(zAxis, roll * this.rollSpeed);
        this.object.up.copy(yAxis);
        this.object.lookAt(0, 0, 0);
    };
}
