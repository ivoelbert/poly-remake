import * as THREE from 'three';
import { constrain01, linearMap } from '../utils/easing';
import { assertExists, isNil, MathUtils } from '../utils/utils';
import { getIdleMoveState, Movements, MoveState, PolyControls } from './polyControls';

export class OrientationControls implements PolyControls {
    public moveState: MoveState;

    private hasFirstRead: boolean;
    private initialOrientation: THREE.Matrix4 | null;

    constructor() {
        this.moveState = getIdleMoveState();
        this.hasFirstRead = false;
        this.initialOrientation = null;
    }

    public dispose = () => {
        this.hasFirstRead = false;
        this.initialOrientation = null;
        window.removeEventListener('deviceorientation', this.handleOrientation);
    };

    public attachListeners = (): void => {
        window.addEventListener('deviceorientation', this.handleOrientation);
    };

    private handleOrientation = (e: DeviceOrientationEvent) => {
        if (isNil(e.alpha) || isNil(e.beta) || isNil(e.gamma)) {
            return;
        }

        const alpha = MathUtils.degToRad(e.alpha);
        const beta = MathUtils.degToRad(e.beta);
        const gamma = MathUtils.degToRad(e.gamma);

        if (!this.hasFirstRead) {
            this.setInitialOrientation(alpha, beta, gamma);
        }

        const invertedInitial = assertExists(this.initialOrientation).clone().invert();

        const euler = new THREE.Euler(alpha, beta, gamma);
        const currentOrientation = new THREE.Matrix4().makeRotationFromEuler(euler);
        const neededRotation = new THREE.Matrix4().multiplyMatrices(
            currentOrientation,
            invertedInitial
        );

        const { x, y, z } = new THREE.Euler().setFromRotationMatrix(neededRotation);

        const up = z > 0 ? constrain01(linearMap(z, 0, 0.5, 0, 1)) : 0;
        const down = z < 0 ? constrain01(linearMap(-z, 0, 0.5, 0, 1)) : 0;

        const right = x > 0 ? constrain01(linearMap(x, 0, 0.5, 0, 1)) : 0;
        const left = x < 0 ? constrain01(linearMap(-x, 0, 0.5, 0, 1)) : 0;

        const rollRight = y > 0 ? constrain01(linearMap(y, 0, 0.5, 0, 1)) : 0;
        const rollLeft = y < 0 ? constrain01(linearMap(-y, 0, 0.5, 0, 1)) : 0;

        this.moveState[Movements.up] = up;
        this.moveState[Movements.down] = down;
        this.moveState[Movements.right] = right;
        this.moveState[Movements.left] = left;
        this.moveState[Movements.rollRight] = rollRight;
        this.moveState[Movements.rollLeft] = rollLeft;
    };

    private setInitialOrientation = (alpha: number, beta: number, gamma: number) => {
        const euler = new THREE.Euler(alpha, beta, gamma);
        this.initialOrientation = new THREE.Matrix4().makeRotationFromEuler(euler);
        this.hasFirstRead = true;
    };
}
