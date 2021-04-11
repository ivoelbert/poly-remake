import * as THREE from 'three';
import { PolyObject } from '../polyObject';
import { MAX_RADIUS } from '../../constants';
import { PolyHitbox } from '../hitbox';
import { EffectsManager } from '../../effects';

export class PolyShip implements PolyObject {
    public mesh: THREE.Object3D;
    public hitbox: PolyHitbox;

    constructor(private effects: EffectsManager) {
        const geometry = this.createGeometry();

        const material = new THREE.MeshBasicMaterial({
            color: 0xfafafa,
            wireframe: true,
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 0, MAX_RADIUS);

        this.hitbox = new PolyHitbox(this.mesh, geometry);
    }

    public update = () => {
        this.hitbox.update();
    };

    public onCollide = (who: PolyObject): void => {
        this.effects.glitch();
    };

    private createGeometry = (): THREE.BufferGeometry => {
        const geometry = new THREE.BufferGeometry();

        const frontPoint = [0, 0, 1];
        const backTop = [0, 0.25, 0];
        const backLeft = [-0.5, -0.25, 0];
        const backRight = [0.5, -0.25, 0];

        const vertices = new Float32Array([
            ...frontPoint,
            ...backTop,
            ...backLeft,

            ...frontPoint,
            ...backTop,
            ...backRight,

            ...frontPoint,
            ...backLeft,
            ...backRight,

            ...backTop,
            ...backLeft,
            ...backRight,
        ]);

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        return geometry;
    };
}
