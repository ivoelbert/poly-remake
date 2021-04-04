import * as THREE from 'three';
import { CENTER_RADIUS } from '../../constants';
import { randFloat, randomUnitVector } from '../../utils/utils';

const FRAGMENT_INITIAL_COLOR = new THREE.Color(0xffff96);
const FRAGMENT_END_COLOR = new THREE.Color(0x610200);

export class ExplosionFragmentMesh {
    public mesh: THREE.Mesh;

    constructor(material: THREE.MeshBasicMaterial) {
        const fragmentSize = randFloat(CENTER_RADIUS * 0.05, CENTER_RADIUS * 0.2);
        const fragmentGeometry = new THREE.TetrahedronBufferGeometry(fragmentSize);

        this.mesh = new THREE.Mesh(fragmentGeometry, material);
    }

    setPosition = (x: number, y: number, z: number) => {
        this.mesh.position.set(x, y, z);
    };

    setRadiusToCenter = (r: number) => {
        this.mesh.position.setLength(r);
    };

    extendRadius = (amount: number) => {
        const dir = this.mesh.position.clone().setLength(amount);
        this.mesh.position.add(dir);
    };
}

export class ExplosionMesh {
    public mesh: THREE.Mesh;
    private fragments: ExplosionFragmentMesh[];
    private fragmentMaterial: THREE.MeshBasicMaterial;

    constructor() {
        this.mesh = new THREE.Mesh();

        this.fragmentMaterial = new THREE.MeshBasicMaterial({
            color: FRAGMENT_INITIAL_COLOR,
            wireframe: true,
            transparent: true,
        });

        this.fragments = this.buildFragments();

        const rotationAngle = randFloat(0, 2 * Math.PI);
        this.mesh.rotateOnAxis(randomUnitVector(), rotationAngle);
    }

    traverseFragments = (cb: (fragment: ExplosionFragmentMesh, idx: number) => void) => {
        this.fragments.forEach((fragment, idx) => cb(fragment, idx));
    };

    updateMaterial = (lifetimeFactor: number) => {
        const opacity = 1 - lifetimeFactor;
        const color = new THREE.Color(FRAGMENT_INITIAL_COLOR).lerp(
            FRAGMENT_END_COLOR,
            lifetimeFactor
        );

        this.fragmentMaterial.opacity = opacity;
        this.fragmentMaterial.color = color;
    };

    private buildFragments = (): ExplosionFragmentMesh[] => {
        const initialPositions = new THREE.SphereGeometry(0.1, 6, 6).getAttribute('position');

        const fragments: ExplosionFragmentMesh[] = [];
        for (let i = 0; i < initialPositions.count; i++) {
            const x = initialPositions.getX(i);
            const y = initialPositions.getY(i);
            const z = initialPositions.getZ(i);

            const fragment = new ExplosionFragmentMesh(this.fragmentMaterial);
            fragment.setPosition(x, y, z);
            this.mesh.add(fragment.mesh);
            fragments.push(fragment);
        }

        return fragments;
    };
}

export class ExplosionMeshFactory {
    public buildMesh = (): ExplosionMesh => {
        return new ExplosionMesh();
    };
}
