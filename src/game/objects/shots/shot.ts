import * as THREE from 'three';
import { PolyObject } from '../polyObject';
import { DropFunction } from '../manager';
import { CENTER_RADIUS } from '../../constants';
import { PolyHitbox } from '../hitbox';
import { MeshFactory } from '../meshFactory';
import { PolyClock } from '../../clock/PolyClock';

export class Shot implements PolyObject {
    public mesh: THREE.Object3D;
    public hitbox: PolyHitbox;

    private drop: () => void;
    private speed: number;

    constructor(meshFactory: MeshFactory, private clock: PolyClock, drop: DropFunction<Shot>) {
        this.mesh = meshFactory.buildMesh();
        this.hitbox = new PolyHitbox(this.mesh, meshFactory.getHitboxGeometry());

        this.speed = 200;
        this.drop = () => drop(this);
    }

    public spawn = (position: THREE.Vector3): void => {
        this.mesh.position.copy(position);
    };

    public onCollide = (who: PolyObject): void => {
        this.drop();
    };

    public update = (): void => {
        const delta = this.clock.getDelta();

        const currentLength = this.mesh.position.length();
        const lengthOffset = this.speed * delta;
        this.mesh.position.setLength(currentLength - lengthOffset);

        this.hitbox.update();

        if (this.mesh.position.length() <= CENTER_RADIUS) {
            this.drop();
        }
    };
}
