import * as THREE from 'three';

export class AsteroidMeshFactory {
    private mesh: THREE.Mesh;
    private hitboxGeometry: THREE.BufferGeometry;

    constructor() {
        this.hitboxGeometry = new THREE.DodecahedronBufferGeometry(1.5);
        const material = new THREE.MeshBasicMaterial({
            color: 0x2bfa2b,
            wireframe: true,
        });

        this.mesh = new THREE.Mesh(this.hitboxGeometry, material);
    }

    public buildMesh = (): THREE.Mesh => {
        return this.mesh.clone() as THREE.Mesh;
    };

    public getHitboxGeometry = (): THREE.BufferGeometry => {
        return this.hitboxGeometry.clone();
    };
}
