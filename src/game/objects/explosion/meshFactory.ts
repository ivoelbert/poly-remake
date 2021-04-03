import * as THREE from 'three';
import { CENTER_RADIUS } from '../../constants';
import { randFloat, randomUnitVector } from '../../utils/utils';

export const FRAGMENT_INITIAL_COLOR = new THREE.Color(0xffff96);
export const FRAGMENT_END_COLOR = new THREE.Color(0x610200);

export class ExplosionMeshFactory {
    public buildMesh = (): THREE.Mesh => {
        const fragmentMaterial = new THREE.MeshBasicMaterial({
            color: FRAGMENT_INITIAL_COLOR,
            wireframe: true,
            transparent: true,
        });

        const groupMesh = new THREE.Mesh();

        const initialPositions = new THREE.SphereGeometry(0.1, 6, 6).getAttribute('position');

        for (let i = 0; i < initialPositions.count; i++) {
            const x = initialPositions.getX(i);
            const y = initialPositions.getY(i);
            const z = initialPositions.getZ(i);
            const fragmentSize = randFloat(CENTER_RADIUS * 0.05, CENTER_RADIUS * 0.2);
            const fragmentGeometry = new THREE.TetrahedronBufferGeometry(fragmentSize);

            const fragmentMesh = new THREE.Mesh(fragmentGeometry, fragmentMaterial);
            fragmentMesh.position.set(x, y, z);

            groupMesh.add(fragmentMesh);
        }

        const rotationAngle = randFloat(0, 2 * Math.PI);
        groupMesh.rotateOnAxis(randomUnitVector(), rotationAngle);
        return groupMesh;
    };
}
