import * as THREE from 'three';
import { PolyObject } from './polyObject';
import { MAX_RADIUS } from '../constants';

export class PolyShip implements PolyObject {
    public mesh: THREE.Object3D;

    constructor() {
        const geometry = new THREE.BoxBufferGeometry();
        const material = new THREE.MeshBasicMaterial({
            color: 0xfafafa,
            wireframe: true,
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 0, MAX_RADIUS);
    }
}
