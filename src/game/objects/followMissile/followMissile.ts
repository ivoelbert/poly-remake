import * as THREE from 'three';
import { PolyObject } from '../polyObject';
import { randomUnitVector, MathUtils } from '../../utils/utils';
import { MissileMeshFactory } from './meshFactory';
import { DropFunction } from '../manager';
import { PolyHitbox } from '../hitbox';
import { PolyClock } from '../../clock/PolyClock';
import { ExplosionsManager } from '../explosion/manager';

const MISSILE_LIFETIME = 7;

export class FollowMissile implements PolyObject {
    public mesh: THREE.Object3D;
    public hitbox: PolyHitbox;

    private direction: THREE.Vector3;
    private angSpeed: number;
    private speed: number;

    private epoch: number;

    constructor(
        private object: THREE.Object3D,
        private clock: PolyClock,
        private explosions: ExplosionsManager,
        meshFactory: MissileMeshFactory,
        private dropObject: DropFunction<FollowMissile>
    ) {
        this.angSpeed = 3;
        this.speed = 40;

        this.mesh = meshFactory.buildMesh();
        this.direction = randomUnitVector();

        this.hitbox = new PolyHitbox(this.mesh, meshFactory.getHitboxGeometry());
        this.epoch = 0;
    }

    public spawn = (position: THREE.Vector3, direction: THREE.Vector3): void => {
        this.epoch = this.clock.getElapsed();
        this.mesh.position.copy(position);
        this.direction.copy(direction);
        this.direction.normalize();

        this.align();
    };

    public update = (): void => {
        this.updateRotation();
        this.updatePosition();
        this.updateFlames();

        this.hitbox.update();

        const elapsed = this.clock.getElapsed();
        const lifeTime = elapsed - this.epoch;

        if (lifeTime > MISSILE_LIFETIME) {
            this.drop();
        }
    };

    public onCollide = (who: PolyObject): void => {
        this.drop();
    };

    private updateRotation = (): void => {
        const delta = this.clock.getDelta();
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
        const delta = this.clock.getDelta();
        const step = this.direction.clone();
        step.multiplyScalar(this.speed * delta);

        this.mesh.position.add(step);
    };

    private updateFlames = (): void => {
        const delta = this.clock.getDelta();
        const elapsed = this.clock.getElapsed();
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

    private drop = () => {
        this.explosions.spawn(this.mesh.position.clone());
        this.dropObject(this);
    };
}
