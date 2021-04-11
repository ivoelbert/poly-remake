import * as THREE from 'three';
import { CENTER_RADIUS } from '../constants';

type RepeatFunction = (index: number) => void;
export const repeat = (times: number, f: RepeatFunction) => {
    for (let i = 0; i < times; i++) {
        f(i);
    }
};

export const MathUtils = THREE.MathUtils;

export function randFloat(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export const randomUnitVector = (): THREE.Vector3 => {
    return new THREE.Vector3(randFloat(-1, 1), randFloat(-1, 1), randFloat(-1, 1)).normalize();
};

export const randomOrthogonalUnitVector = (vec: THREE.Vector3): THREE.Vector3 => {
    const x = new THREE.Vector3(1, 0, 0);
    const y = new THREE.Vector3(0, 1, 0);
    const z = new THREE.Vector3(0, 0, 1);

    const mostPerpendicular = [y, z].reduce((best, current) => {
        if (vec.dot(best) > vec.dot(current)) {
            return current;
        }
        return best;
    }, x);

    if (chance(0.5)) {
        mostPerpendicular.negate();
    }

    return new THREE.Vector3().crossVectors(vec, mostPerpendicular);
};

export const randomTinyVector = (): THREE.Vector3 => {
    return randomUnitVector().setLength(0.00001);
};

export const getOrigin = (): THREE.Vector3 => {
    return new THREE.Vector3(0, 0, 0);
};

export const chance = (p: number): boolean => {
    return randFloat(0, 1) < p;
};

// The dumpster has to be very, very far from the center so the camera doesn't catch it.
const DUMPSTER_POSITION = CENTER_RADIUS * 1000;
export const getDumpster = (): THREE.Vector3 => {
    return new THREE.Vector3(DUMPSTER_POSITION, DUMPSTER_POSITION, DUMPSTER_POSITION);
};

export type nil = undefined | null;

export const isNil = (value: any): value is nil => {
    return value === undefined || value === null;
};

export const assertExists = <T>(value: T | nil, msg?: string): T => {
    if (isNil(value)) {
        throw new UnexpectedNilError(msg);
    } else {
        return value;
    }
};

export class UnexpectedNilError extends Error {
    constructor(msg?: string) {
        super(msg ?? 'Unexpected nil value!');
    }
}

export const consoleInfo = (message: string): void => {
    const styles = `
        background-color: #dadada;
        color: #2b2bfa;
        margin: 1em;
        padding: 0.5em 1em;
        border-radius: 9999px;
        font-size: 14px;
        text-align: center;
        font-weight: 800;
    `;
    console.log(`%c${message}`, styles);
};

export const noop = () => {};

export const getOne = <T>(set: Set<T>): T | nil => {
    return set.values().next().value;
};

export const debug = (info: string): void => {
    const debugElement = assertExists(document.getElementById('debug-element'));
    debugElement.style.display = 'block';
    debugElement.textContent = info;
};

export type CancelAction = () => void;
export type VoidCallback = () => void;
