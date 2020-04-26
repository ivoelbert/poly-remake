import * as THREE from 'three';

export class FollowCamera extends THREE.PerspectiveCamera {
    private distance: number;

    constructor(private followedObject: THREE.Object3D) {
        super(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.distance = 2;
        this.update();
    }

    update = (): void => {
        const followedPosition = this.followedObject.position.clone();
        followedPosition.add(followedPosition.clone().normalize().multiplyScalar(this.distance));

        this.position.copy(followedPosition);
        this.up.copy(this.followedObject.up);
        this.lookAt(0, 0, 0);
    };
}
