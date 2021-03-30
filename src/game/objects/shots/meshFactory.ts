import * as THREE from 'three';

export class ShotMeshFactory {
    private mesh: THREE.Mesh;
    private hitboxGeometry: THREE.Geometry | THREE.BufferGeometry;

    constructor() {
        const coreGeometry = new THREE.DodecahedronBufferGeometry(0.15);
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: 0xfff36e,
            wireframe: true,
        });

        const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);

        this.hitboxGeometry = new THREE.DodecahedronBufferGeometry(0.3);
        const material = new THREE.MeshBasicMaterial({
            color: 0xd68400,
            wireframe: true,
        });

        this.mesh = new THREE.Mesh(this.hitboxGeometry, material);
        this.mesh.add(coreMesh);
    }

    public buildMesh = (): THREE.Mesh => {
        return this.mesh.clone();
    };

    public getHitboxGeometry = (): THREE.Geometry | THREE.BufferGeometry => {
        return this.hitboxGeometry.clone();
    };
}
