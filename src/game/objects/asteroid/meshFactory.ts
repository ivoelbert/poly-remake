import * as THREE from 'three';
import { MeshFactory } from '../meshFactory';

export class AsteroidMeshFactory implements MeshFactory {
    private mesh: THREE.Mesh;
    private hitboxGeometry: THREE.Geometry | THREE.BufferGeometry;

    constructor() {
        this.hitboxGeometry = new THREE.DodecahedronBufferGeometry(1);
        const material = new THREE.MeshBasicMaterial({
            color: 0x2bfa2b,
            wireframe: true,
        });

        this.mesh = new THREE.Mesh(this.hitboxGeometry, material);
    }

    public buildMesh = (): THREE.Mesh => {
        return this.mesh.clone();
    };

    public getHitboxGeometry = (): THREE.Geometry | THREE.BufferGeometry => {
        return this.hitboxGeometry.clone();
    };
}