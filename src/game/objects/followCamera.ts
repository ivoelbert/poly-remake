import * as THREE from 'three';
import { PolyClock } from '../clock/PolyClock';

export class FollowCamera extends THREE.PerspectiveCamera {
    private clock: PolyClock;
    private distance: number;
    private inertiaFactor: number;

    constructor(private followedObject: THREE.Object3D) {
        super(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.distance = 2;
        this.inertiaFactor = 0.8;
        this.clock = PolyClock.getInstance();

        this.update();
    }

    // TODO: Make movement (and probably followCamera) frame independent
    // See https://github.com/ivoelbert/poly-remake/issues/2
    update = (): void => {
        const followedPosition = this.followedObject.position.clone();
        followedPosition.add(followedPosition.clone().normalize().multiplyScalar(this.distance));

        const newPosition = new THREE.Vector3().lerpVectors(
            this.position,
            followedPosition,
            this.inertiaFactor
        );

        this.position.copy(newPosition);
        this.up.copy(this.followedObject.up);
        this.lookAt(0, 0, 0);
    };
}
