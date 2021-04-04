import * as THREE from 'three';
import { PolyClock } from '../../clock/PolyClock';
import { CENTER_RADIUS } from '../../constants';
import { constrain01, linearMap } from '../../utils/easing';
import { noop, randFloat } from '../../utils/utils';
import { Hitbox, NoCollisionsHitbox } from '../hitbox';
import { DropFunction } from '../manager';
import { PolyObject } from '../polyObject';
import { ExplosionMesh, ExplosionMeshFactory } from './meshFactory';

const FRAGMENT_LIFETIME = 1;

export class Explosion implements PolyObject {
    public hitbox: Hitbox;

    private explosionMesh: ExplosionMesh;
    private epoch: number;
    private fragmentSpeeds: number[];

    constructor(
        meshFactory: ExplosionMeshFactory,
        private clock: PolyClock,
        private dropObject: DropFunction<Explosion>
    ) {
        this.explosionMesh = meshFactory.buildMesh();
        this.hitbox = new NoCollisionsHitbox();

        this.epoch = 0;
        this.fragmentSpeeds = this.getRandomSpeeds();
    }

    get mesh(): THREE.Mesh {
        return this.explosionMesh.mesh;
    }

    spawn = (position: THREE.Vector3): void => {
        this.mesh.position.copy(position);
        this.epoch = this.clock.getElapsed();
        this.fragmentSpeeds = this.getRandomSpeeds();
        this.explosionMesh.traverseFragments((fragment) => {
            fragment.setRadiusToCenter(0.1);
        });
    };

    onCollide = noop;

    update = (): void => {
        const elapsed = this.clock.getElapsed();
        const delta = this.clock.getDelta();
        const lifeTime = elapsed - this.epoch;

        this.explosionMesh.traverseFragments((fragment, idx) => {
            const speed = this.fragmentSpeeds[idx];
            fragment.extendRadius(delta * speed);
        });

        const materialLifetimeFactor = constrain01(linearMap(lifeTime, 0, FRAGMENT_LIFETIME, 0, 1));
        this.explosionMesh.updateMaterial(materialLifetimeFactor);

        if (lifeTime > FRAGMENT_LIFETIME) {
            this.drop();
        }
    };

    private getRandomSpeeds = (): number[] => {
        const speeds: number[] = [];
        this.explosionMesh.traverseFragments((_) => {
            const speed = randFloat(0.5 * CENTER_RADIUS, 1 * CENTER_RADIUS);
            speeds.push(speed);
        });
        return speeds;
    };

    private drop = () => {
        this.dropObject(this);
    };
}
