import * as THREE from 'three';
import { repeat, MathUtils } from '../../utils/utils';
import { CENTER_RADIUS } from '../../constants';

export class Stars {
    public mesh: THREE.Group;

    constructor() {
        this.mesh = new THREE.Group();

        const starsMaterials = [
            new THREE.PointsMaterial({
                color: 0x555555,
                size: 2,
                sizeAttenuation: false,
            }),
            new THREE.PointsMaterial({
                color: 0x555555,
                size: 1,
                sizeAttenuation: false,
            }),
            new THREE.PointsMaterial({
                color: 0x333333,
                size: 2,
                sizeAttenuation: false,
            }),
            new THREE.PointsMaterial({
                color: 0x3a3a3a,
                size: 1,
                sizeAttenuation: false,
            }),
            new THREE.PointsMaterial({
                color: 0x1a1a1a,
                size: 2,
                sizeAttenuation: false,
            }),
            new THREE.PointsMaterial({
                color: 0x1a1a1a,
                size: 1,
                sizeAttenuation: false,
            }),
        ];

        starsMaterials.forEach((material) => {
            const geometry = this.createStarsGeometry();
            const stars = new THREE.Points(geometry, material);
            stars.matrixAutoUpdate = false;
            stars.updateMatrix();

            this.mesh.add(stars);
        });
    }

    private createStarsGeometry = (): THREE.Geometry => {
        const starsGeometry = new THREE.Geometry();

        repeat(1000, (i: number) => {
            const vertex = new THREE.Vector3(
                MathUtils.randFloat(-1, 1),
                MathUtils.randFloat(-1, 1),
                MathUtils.randFloat(-1, 1)
            );
            const distance = MathUtils.randFloat(CENTER_RADIUS * 20, CENTER_RADIUS * 100);
            vertex.multiplyScalar(distance);

            starsGeometry.vertices.push(vertex);
        });

        return starsGeometry;
    };
}
