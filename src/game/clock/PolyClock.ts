import * as THREE from 'three';

/**
 * The delta and elapsed must be recomputed with `tick` on every render
 */
export interface ClockTick {
    delta: number;
    elapsed: number;
}

export class PolyClock {
    private clock: THREE.Clock;
    private delta: number;
    private elapsed: number;

    constructor() {
        // Autostarts
        this.clock = new THREE.Clock();
        this.delta = 0;
        this.elapsed = 0;
    }

    public getDelta = (): number => {
        return this.delta;
    };

    public getElapsed = (): number => {
        return this.elapsed;
    };

    public tick = (): void => {
        this.delta = this.clock.getDelta();
        this.elapsed = this.clock.getElapsedTime();
    };
}
