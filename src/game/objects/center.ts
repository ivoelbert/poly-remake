import * as THREE from 'three';
import { PolyObject } from './polyObject';
import { CENTER_RADIUS } from '../constants';
import { PolyHitbox } from './hitbox';
import { PolyClock } from '../clock/PolyClock';
import { linearMap } from '../utils/easing';

export class Center implements PolyObject {
    public mesh: THREE.Group;
    public hitbox: PolyHitbox;

    constructor(private clock: PolyClock) {
        this.mesh = new THREE.Group();

        const geometry = new THREE.SphereBufferGeometry(CENTER_RADIUS, 16, 12);
        const material = new THREE.MeshBasicMaterial({
            color: 0xfa2b2b,
            wireframe: true,
        });

        const centerMesh = new THREE.Mesh(geometry, material);
        this.mesh.add(centerMesh);

        this.hitbox = new PolyHitbox(this.mesh, geometry);
    }

    update = () => {
        const elapsed = this.clock.getElapsed();

        const scale = linearMap(Math.sin(elapsed * 10), -1, 1, 0.99, 1.01);

        this.mesh.scale.set(scale, scale, scale);
    };
}
