import * as THREE from 'three';
import { PolyHitbox } from './hitbox';

export interface PolyObject {
    mesh: THREE.Object3D;
    update?: () => void;
    hitbox: PolyHitbox;
    onCollide?: (who: PolyObject) => void;
}
