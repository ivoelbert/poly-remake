import * as THREE from 'three';

export function linearMap(x: number, a1: number, a2: number, b1: number, b2: number): number {
    return THREE.MathUtils.mapLinear(x, a1, a2, b1, b2);
}

export function constrain(x: number, lo: number, hi: number): number {
    if (x < lo) {
        return lo;
    }

    if (x > hi) {
        return hi;
    }

    return x;
}

export function constrain01(x: number): number {
    return constrain(x, 0, 1);
}

export function easeOutElastic(x: number): number {
    const c4 = (2 * Math.PI) / 3;

    return x === 0 ? 0 : x === 1 ? 1 : 2 ** (-10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}
