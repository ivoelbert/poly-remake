import * as THREE from 'three';
import { assertExists, isNil } from '../utils/utils';
import { PolyScene } from '../scene/PolyScene';

export class PolyHitbox {
    public shape: THREE.Sphere;
    private hitboxDebug: THREE.Mesh | null;

    constructor(
        private followedObject: THREE.Object3D,
        geometry: THREE.Geometry | THREE.BufferGeometry
    ) {
        const internalGeometry = geometry.clone();
        internalGeometry.computeBoundingSphere();
        this.shape = assertExists(internalGeometry.boundingSphere);

        this.hitboxDebug = null;

        this.update();
        //this.debug();
    }

    debug = (): void => {
        const scene = PolyScene.getInstance();

        const geometry = new THREE.SphereBufferGeometry(this.shape.radius, 8, 6);
        const material = new THREE.MeshBasicMaterial({
            color: 0x324ca8,
            wireframe: true,
        });

        this.hitboxDebug = new THREE.Mesh(geometry, material);

        scene.add(this.hitboxDebug);

        this.update();
    };

    update = (): void => {
        const objectPosition = this.followedObject.position.clone();
        this.shape.center.copy(objectPosition);
        if (!isNil(this.hitboxDebug)) {
            this.hitboxDebug.position.copy(objectPosition);
        }
    };

    intersects = (hitbox: PolyHitbox): boolean => {
        return this.shape.intersectsSphere(hitbox.shape);
    };
}
