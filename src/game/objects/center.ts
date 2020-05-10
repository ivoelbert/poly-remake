import * as THREE from 'three';
import { PolyObject } from './polyObject';
import { CENTER_RADIUS } from '../constants';
import { PolyHitbox } from './hitbox';

export class Center implements PolyObject {
    public mesh: THREE.Group;
    public hitbox: PolyHitbox;

    constructor() {
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
}
