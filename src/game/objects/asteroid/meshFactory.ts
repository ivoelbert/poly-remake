import * as THREE from 'three';
import { MeshFactory } from '../meshFactory';

export class AsteroidMeshFactory implements MeshFactory {
    private mesh: THREE.Mesh;

    constructor() {
        const geometry = new THREE.DodecahedronBufferGeometry(1);
        const material = new THREE.MeshBasicMaterial({
            color: 0x2bfa2b,
            wireframe: true,
        });

        this.mesh = new THREE.Mesh(geometry, material);
    }

    public buildMesh = (): THREE.Mesh => {
        return this.mesh.clone();
    };
}
