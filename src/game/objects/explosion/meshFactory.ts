import * as THREE from 'three';
import { CENTER_RADIUS } from '../../constants';
import { randFloat, randomUnitVector } from '../../utils/utils';
import { MeshFactory } from '../meshFactory';

export const FRAGMENT_INITIAL_COLOR = new THREE.Color(0xffff96);
export const FRAGMENT_END_COLOR = new THREE.Color(0x610200);

export class ExplosionMeshFactory implements MeshFactory {
    private hitboxGeometry: THREE.Geometry | THREE.BufferGeometry;

    constructor() {
        // No hitbox for explosions, yet.
        this.hitboxGeometry = new THREE.Geometry();
    }

    public buildMesh = (): THREE.Mesh => {
        const fragmentMaterial = new THREE.MeshBasicMaterial({
            color: FRAGMENT_INITIAL_COLOR,
            wireframe: true,
            transparent: true,
        });

        const groupMesh = new THREE.Mesh();

        const initialPositions = new THREE.SphereGeometry(0.1, 6, 6).vertices;

        initialPositions.forEach((initialPosition) => {
            const fragmentSize = randFloat(CENTER_RADIUS * 0.05, CENTER_RADIUS * 0.2);
            const fragmentGeometry = new THREE.TetrahedronBufferGeometry(fragmentSize);

            const fragmentMesh = new THREE.Mesh(fragmentGeometry, fragmentMaterial);
            fragmentMesh.position.copy(initialPosition);

            groupMesh.add(fragmentMesh);
        });

        const rotationAngle = randFloat(0, 2 * Math.PI);
        groupMesh.rotateOnAxis(randomUnitVector(), rotationAngle);
        return groupMesh;
    };

    public getHitboxGeometry = (): THREE.Geometry | THREE.BufferGeometry => {
        return this.hitboxGeometry.clone();
    };
}
