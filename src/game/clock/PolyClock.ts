import * as THREE from 'three';

/**
 * Singleton clock, anyone can get the instance and check the delta time.
 *
 * The delta must be recomputed with `tick` on every render
 */
export class PolyClock {
    private clock: THREE.Clock;
    public delta: number;
    public elapsed: number;
    private static instance: PolyClock;

    private constructor() {
        // Autostarts
        this.clock = new THREE.Clock();
        this.delta = 0;
        this.elapsed = 0;
    }

    static getInstance = (): PolyClock => {
        if (!PolyClock.instance) {
            PolyClock.instance = new PolyClock();
        }

        return PolyClock.instance;
    };

    public tick = (): void => {
        this.delta = this.clock.getDelta();
        this.elapsed = this.clock.getElapsedTime();
    };
}
