import * as THREE from 'three';
import { PolyObject } from '../polyObject';
import { DropFunction } from '../manager';
import { PolyHitbox } from '../hitbox';
import { PolyClock } from '../../clock/PolyClock';
import { constrain01, easeOutElastic, linearMap } from '../../utils/easing';
import { MAX_RADIUS } from '../../constants';
import { ExplosionsManager } from '../explosion/manager';
import { AsteroidMeshFactory } from './meshFactory';

const SPAWN_ANIMATION_TIME = 1;

export class Asteroid implements PolyObject {
    public mesh: THREE.Object3D;
    public hitbox: PolyHitbox;

    private normal: THREE.Vector3;
    private angularVelocity: number;
    private radialVelocity: number;

    private epoch: number;

    constructor(
        meshFactory: AsteroidMeshFactory,
        private clock: PolyClock,
        private explosions: ExplosionsManager,
        private dropObject: DropFunction<Asteroid>
    ) {
        this.mesh = meshFactory.buildMesh();
        this.hitbox = new PolyHitbox(this.mesh, meshFactory.getHitboxGeometry());

        this.normal = new THREE.Vector3(0, 1, 0);

        this.angularVelocity = 1;
        this.radialVelocity = 1;
        this.epoch = 0;
    }

    public spawn = (position: THREE.Vector3, normal: THREE.Vector3): void => {
        this.mesh.position.copy(position);
        this.normal = normal;
        this.epoch = this.clock.getElapsed();
    };

    public onCollide = (who: PolyObject): void => {
        this.drop();
    };

    public update = (): void => {
        const delta = this.clock.getDelta();
        const elapsed = this.clock.getElapsed();

        const lifeTime = elapsed - this.epoch;
        const timeFactor = constrain01(linearMap(lifeTime, 0, SPAWN_ANIMATION_TIME, 0, 1));
        const easedTimeFactor = easeOutElastic(timeFactor);

        this.mesh.scale.set(easedTimeFactor, easedTimeFactor, easedTimeFactor);

        // Rotation
        const angleToRotate = this.angularVelocity * delta;
        this.mesh.position.applyAxisAngle(this.normal, angleToRotate);

        // radial movement
        const currentLength = this.mesh.position.length();
        const lengthOffset = this.radialVelocity * delta;
        this.mesh.position.setLength(currentLength + lengthOffset);

        this.hitbox.update();

        if (tooFarFromCenter(this.mesh.position)) {
            this.drop();
        }
    };

    private drop = () => {
        this.explosions.spawn(this.mesh.position.clone());
        this.dropObject(this);
    };
}

function tooFarFromCenter(point: THREE.Vector3): boolean {
    return point.length() > MAX_RADIUS;
}
