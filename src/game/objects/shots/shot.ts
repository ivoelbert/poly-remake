import * as THREE from 'three';
import { PolyObject } from '../polyObject';
import { Vector3 } from 'three';
import { PolyClock } from '../../clock/PolyClock';
import { DropFunction } from '../manager';
import { ShotMeshFactory } from './meshFactory';
import { CENTER_RADIUS } from '../../constants';

export class Shot implements PolyObject {
    public mesh: THREE.Object3D;
    private drop: () => void;
    private speed: number;
    private clock: PolyClock;

    constructor(meshFactory: ShotMeshFactory, drop: DropFunction<Shot>) {
        this.mesh = meshFactory.buildMesh();

        this.speed = 200;
        this.clock = PolyClock.getInstance();
        this.drop = () => drop(this);
    }

    public spawn = (position: Vector3): void => {
        this.mesh.position.copy(position);
    };

    public update = (): void => {
        const { delta } = this.clock;

        const currentLength = this.mesh.position.length();
        const lengthOffset = this.speed * delta;
        this.mesh.position.setLength(currentLength - lengthOffset);

        if (this.mesh.position.length() <= CENTER_RADIUS) {
            this.drop();
        }
    };
}
