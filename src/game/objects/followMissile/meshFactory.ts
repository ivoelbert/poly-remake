import * as THREE from 'three';
import { MeshFactory } from '../meshFactory';

export class MissileMeshFactory implements MeshFactory {
    private mesh: THREE.Mesh;
    private hitboxGeometry: THREE.Geometry | THREE.BufferGeometry;

    constructor() {
        this.hitboxGeometry = new THREE.CylinderBufferGeometry(0.2, 0.4, 1, 6, 1);
        const misilMaterial = new THREE.MeshBasicMaterial({
            wireframe: true,
            color: 0xffffff,
        });

        const fireGeom = new THREE.ConeBufferGeometry(0.3, 1, 6);

        const lightFireMat = new THREE.MeshBasicMaterial({
            wireframe: true,
            color: 0xeeec74,
        });

        const darkFireMat = new THREE.MeshBasicMaterial({
            wireframe: true,
            color: 0xee5137,
        });

        const lightFire = new THREE.Mesh(fireGeom, lightFireMat);
        const darkFire = new THREE.Mesh(fireGeom, darkFireMat);
        lightFire.position.y -= 1;
        darkFire.position.y -= 1;
        lightFire.rotateX(Math.PI);
        darkFire.rotateX(Math.PI);

        this.mesh = new THREE.Mesh(this.hitboxGeometry, misilMaterial);
        this.mesh.add(lightFire);
        this.mesh.add(darkFire);
    }

    public buildMesh = (): THREE.Mesh => {
        return this.mesh.clone();
    };

    public getHitboxGeometry = (): THREE.Geometry | THREE.BufferGeometry => {
        return this.hitboxGeometry.clone();
    };
}
