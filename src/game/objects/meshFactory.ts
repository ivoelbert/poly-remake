export interface MeshFactory {
    buildMesh: () => THREE.Mesh;
    getHitboxGeometry: () => THREE.Geometry | THREE.BufferGeometry;
}
