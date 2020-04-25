import * as THREE from 'three';

type RepeatFunction = (index: number) => void;
export const repeat = (times: number, f: RepeatFunction) => {
    for (let i = 0; i < times; i++) {
        f(i);
    }
};

export const MathUtils = THREE.MathUtils;

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
    `
    console.log(`%c${message}`, styles)
}

export const noop = () => {}