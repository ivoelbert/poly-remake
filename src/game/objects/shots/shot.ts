import * as THREE from 'three';
import { PolyObject } from '../polyObject';
import { Vector3 } from 'three';
import { PolyClock } from '../../clock/PolyClock';
import { DropFunction } from '../manager';
import { ShotMeshFactory } from './meshFactory';
import { CENTER_RADIUS } from '../../constants';
import { PolyHitbox } from '../hitbox';

export class Shot implements PolyObject {
    public mesh: THREE.Object3D;
    public hitbox: PolyHitbox;

    private drop: () => void;
    private speed: number;
    private clock: PolyClock;

    constructor(meshFactory: ShotMeshFactory, drop: DropFunction<Shot>) {
        this.mesh = meshFactory.buildMesh();
        this.hitbox = new PolyHitbox(this.mesh, meshFactory.getHitboxGeometry());

        this.speed = 200;
        this.clock = PolyClock.getInstance();
        this.drop = () => drop(this);
    }

    public spawn = (position: Vector3): void => {
        this.mesh.position.copy(position);
    };

    public onCollide = (who: PolyObject): void => {
        this.drop();
    };

    public update = (): void => {
        const { delta } = this.clock;

        const currentLength = this.mesh.position.length();
        const lengthOffset = this.speed * delta;
        this.mesh.position.setLength(currentLength - lengthOffset);

        this.hitbox.update();

        if (this.mesh.position.length() <= CENTER_RADIUS) {
            this.drop();
        }
    };
}
