import * as THREE from 'three';
import { assertExists, getDumpster, isNil } from '../utils/utils';
import { PolyScene } from '../scene/PolyScene';

export interface Hitbox {
    intersects(hitbox: Hitbox): boolean;
    shape: THREE.Sphere;
}

export class PolyHitbox implements Hitbox {
    readonly shape: THREE.Sphere;
    private hitboxDebug: THREE.Mesh | null;

    constructor(private followedObject: THREE.Object3D, geometry: THREE.BufferGeometry) {
        const internalGeometry = geometry.clone();
        internalGeometry.computeBoundingSphere();
        this.shape = assertExists(internalGeometry.boundingSphere);

        this.hitboxDebug = null;

        this.update();
    }

    debug = (scene: PolyScene): void => {
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

    intersects = (hitbox: Hitbox): boolean => {
        return this.shape.intersectsSphere(hitbox.shape);
    };
}

export class NoCollisionsHitbox implements Hitbox {
    readonly shape: THREE.Sphere = new THREE.Sphere(getDumpster(), 0);

    intersects = (hitbox: Hitbox): boolean => {
        return false;
    };
}
