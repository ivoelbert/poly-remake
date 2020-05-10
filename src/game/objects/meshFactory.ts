export interface MeshFactory {
    buildMesh: () => void;
    getHitboxGeometry: () => THREE.Geometry | THREE.BufferGeometry;
}
