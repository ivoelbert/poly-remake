import * as THREE from 'three';
import { Hitbox } from './hitbox';

export interface PolyObject {
    mesh: THREE.Object3D;
    update?: () => void;
    hitbox: Hitbox;
    onCollide?: (who: PolyObject) => void;
}
