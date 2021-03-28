import * as THREE from 'three';
import { PolyClock } from '../../clock/PolyClock';
import { CENTER_RADIUS } from '../../constants';
import { constrain01, linearMap } from '../../utils/easing';
import { noop, randFloat } from '../../utils/utils';
import { PolyHitbox } from '../hitbox';
import { DropFunction } from '../manager';
import { MeshFactory } from '../meshFactory';
import { PolyObject } from '../polyObject';
import { FRAGMENT_END_COLOR, FRAGMENT_INITIAL_COLOR } from './meshFactory';

const FRAGMENT_LIFETIME_MS = 1000;

export class Explosion implements PolyObject {
    public mesh: THREE.Object3D;
    public hitbox: PolyHitbox;

    private drop: () => void;
    private epoch: number;
    private fragmentSpeeds: number[];

    constructor(meshFactory: MeshFactory, private clock: PolyClock, drop: DropFunction<Explosion>) {
        this.mesh = meshFactory.buildMesh();
        this.hitbox = new PolyHitbox(this.mesh, meshFactory.getHitboxGeometry());

        this.epoch = 0;
        this.fragmentSpeeds = this.getRandomSpeeds();

        this.drop = () => drop(this);
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

        const fragmentLifetime = FRAGMENT_LIFETIME_MS / 1000;

        const opacity = constrain01(linearMap(lifeTime, 0, fragmentLifetime, 1, 0));

        const colorFactor = constrain01(linearMap(lifeTime, 0, fragmentLifetime, 0, 1));
        const color = new THREE.Color(FRAGMENT_INITIAL_COLOR).lerp(FRAGMENT_END_COLOR, colorFactor);

        this.mesh.children.forEach((fragmentObject, idx) => {
            const speed = this.fragmentSpeeds[idx];
            const fragment = fragmentObject as THREE.Mesh;

            const dir = fragment.position.clone().setLength(delta * speed);
            fragment.position.add(dir);
            (fragment.material as THREE.MeshBasicMaterial).opacity = opacity;
            (fragment.material as THREE.MeshBasicMaterial).color = color;
        });

        if (lifeTime > fragmentLifetime) {
            this.drop();
        }
    };

    private getRandomSpeeds = (): number[] => {
        return this.mesh.children.map((_) => {
            return randFloat(0.5 * CENTER_RADIUS, 1 * CENTER_RADIUS);
        });
    };
}
