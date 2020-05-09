import * as THREE from 'three';
import { TOO_FAR_TO_CARE, CENTER_RADIUS } from './constants';

type RepeatFunction = (index: number) => void;
export const repeat = (times: number, f: RepeatFunction) => {
    for (let i = 0; i < times; i++) {
        f(i);
    }
};

export const MathUtils = THREE.MathUtils;

export const randomUnitVector = (): THREE.Vector3 => {
    return new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
};

export const getOrigin = (): THREE.Vector3 => {
    return new THREE.Vector3(0, 0, 0);
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

export const tooFarFromCenter = (point: THREE.Vector3) => point.length() > TOO_FAR_TO_CARE;

export const getOne = <T>(set: Set<T>): T | nil => {
    return set.values().next().value;
};
