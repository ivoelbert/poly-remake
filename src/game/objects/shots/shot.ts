import * as THREE from 'three';
import { PolyObject } from '../polyObject';
import { DropFunction } from '../manager';
import { CENTER_RADIUS } from '../../constants';
import { PolyHitbox } from '../hitbox';
import { PolyClock } from '../../clock/PolyClock';
import { ShotMeshFactory } from './meshFactory';

export class Shot implements PolyObject {
    public mesh: THREE.Object3D;
    public hitbox: PolyHitbox;

    private speed: number;

    constructor(
        meshFactory: ShotMeshFactory,
        private clock: PolyClock,
        private dropObject: DropFunction<Shot>
    ) {
        this.mesh = meshFactory.buildMesh();
        this.hitbox = new PolyHitbox(this.mesh, meshFactory.getHitboxGeometry());

        this.speed = 200;
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

    private drop = () => {
        this.dropObject(this);
    };
}
