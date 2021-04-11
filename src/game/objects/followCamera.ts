import * as THREE from 'three';

export class FollowCamera extends THREE.PerspectiveCamera {
    private distance: number;
    private inertiaFactor: number;
    private followedObject: THREE.Object3D;

    constructor() {
        super(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.distance = 2;
        this.inertiaFactor = 0.8;

        this.followedObject = new THREE.Object3D();
    }

    follow = (objectToFollow: THREE.Object3D): void => {
        this.followedObject = objectToFollow;
        this.update();
    };

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
