import * as THREE from 'three';
import { PolyObject } from './polyObject';
import { randomVector3, getOrigin, MathUtils } from '../utils';
import { PolyClock } from '../clock/PolyClock';

export class FollowMissile implements PolyObject {
    public mesh: THREE.Object3D;
    private direction: THREE.Vector3;
    private clock: PolyClock;

    private angSpeed: number;
    private speed: number;

    constructor(private object: THREE.Object3D, startPosition?: THREE.Vector3, direction?: THREE.Vector3) {
        this.clock = PolyClock.getInstance();

        this.angSpeed = 3;
        this.speed = 40;

        this.mesh = misilMesh.clone();
        this.mesh.position.copy(startPosition ?? getOrigin());
        this.direction = direction ?? randomVector3();
        this.direction.normalize();

        this.align();
    }

    public update = (): void => {
        this.updateRotation();
        this.updatePosition();
        this.updateFlames();
    };

    private updateRotation = (): void => {
        const delta = this.clock.delta;

        const towards = this.object.position.clone();
        towards.sub(this.mesh.position);

        const angle = this.direction.angleTo(towards);
        const clampedAngle = MathUtils.clamp(angle, -this.angSpeed * delta, this.angSpeed * delta);

        const normal = new THREE.Vector3().crossVectors(towards, this.direction);
        normal.normalize();

        this.direction.applyAxisAngle(normal, -clampedAngle);
        this.align();
    };

    private updatePosition = (): void => {
        const delta = this.clock.delta;

        const step = this.direction.clone();
        step.multiplyScalar(this.speed * delta);

        this.mesh.position.add(step);
    };

    private updateFlames = (): void => {
        const delta = this.clock.delta;
        const elapsed = this.clock.elapsed;

        this.mesh.children[0].scale.y += Math.sin(elapsed * 10) * 0.05;
        this.mesh.children[0].rotateY(delta * 10);
        this.mesh.children[1].scale.y -= Math.cos(elapsed * 10) * 0.05;
        this.mesh.children[1].rotateY(delta * 10);
    };

    private align = (): void => {
        const lookAtPos = this.mesh.position.clone();
        lookAtPos.add(this.direction);
        this.mesh.lookAt(lookAtPos);
        this.mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI * 0.5);
    };
}

const misilGeometry = new THREE.CylinderBufferGeometry(0.2, 0.4, 1, 6, 1);
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

const misilMesh = new THREE.Mesh(misilGeometry, misilMaterial);
misilMesh.add(lightFire);
misilMesh.add(darkFire);
