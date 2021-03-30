import * as THREE from 'three';
import { PolyClock } from '../../clock/PolyClock';
import { CENTER_RADIUS } from '../../constants';
import { constrain01, linearMap } from '../../utils/easing';
import { noop, randFloat } from '../../utils/utils';
import { Hitbox, NoCollisionsHitbox } from '../hitbox';
import { DropFunction } from '../manager';
import { PolyObject } from '../polyObject';
import { ExplosionMeshFactory, FRAGMENT_END_COLOR, FRAGMENT_INITIAL_COLOR } from './meshFactory';

const FRAGMENT_LIFETIME = 1;

export class Explosion implements PolyObject {
    public mesh: THREE.Object3D;
    public hitbox: Hitbox;

    private epoch: number;
    private fragmentSpeeds: number[];

    constructor(
        meshFactory: ExplosionMeshFactory,
        private clock: PolyClock,
        private dropObject: DropFunction<Explosion>
    ) {
        this.mesh = meshFactory.buildMesh();
        this.hitbox = new NoCollisionsHitbox();

        this.epoch = 0;
        this.fragmentSpeeds = this.getRandomSpeeds();
    }

    public spawn = (position: THREE.Vector3): void => {
        this.mesh.position.copy(position);
        this.epoch = this.clock.getElapsed();
        this.fragmentSpeeds = this.getRandomSpeeds();
        this.mesh.children.forEach((fragmentObject) => {
            fragmentObject.position.setLength(0.1);
        });
    };

    public onCollide = noop;

    public update = (): void => {
        const elapsed = this.clock.getElapsed();
        const delta = this.clock.getDelta();
        const lifeTime = elapsed - this.epoch;

        const opacity = constrain01(linearMap(lifeTime, 0, FRAGMENT_LIFETIME, 1, 0));

        const colorFactor = constrain01(linearMap(lifeTime, 0, FRAGMENT_LIFETIME, 0, 1));
        const color = new THREE.Color(FRAGMENT_INITIAL_COLOR).lerp(FRAGMENT_END_COLOR, colorFactor);

        this.mesh.children.forEach((fragmentObject, idx) => {
            const speed = this.fragmentSpeeds[idx];
            const fragment = fragmentObject as THREE.Mesh;

            const dir = fragment.position.clone().setLength(delta * speed);
            fragment.position.add(dir);
            (fragment.material as THREE.MeshBasicMaterial).opacity = opacity;
            (fragment.material as THREE.MeshBasicMaterial).color = color;
        });

        if (lifeTime > FRAGMENT_LIFETIME) {
            this.drop();
        }
    };

    private getRandomSpeeds = (): number[] => {
        return this.mesh.children.map((_) => {
            return randFloat(0.5 * CENTER_RADIUS, 1 * CENTER_RADIUS);
        });
    };

    private drop = () => {
        this.dropObject(this);
    };
}
