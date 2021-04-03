import * as THREE from 'three';

function isRenderItem(obj: any): obj is THREE.RenderItem {
    return 'geometry' in obj && 'material' in obj;
}

function disposeMaterial(obj: THREE.Object3D) {
    if (!isRenderItem(obj)) return;

    // because obj.material can be a material or array of materials
    const materials: THREE.Material[] = ([] as THREE.Material[]).concat(obj.material);

    for (const material of materials) {
        material.dispose();
    }
}

export class PolyScene {
    public readonly scene: THREE.Scene;

    constructor() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x000000, 0.000025);

        const light = new THREE.AmbientLight(0xffffff);
        this.scene.add(light);
    }

    public add = (...objects: THREE.Object3D[]) => this.scene.add(...objects);

    public remove = (...objects: THREE.Object3D[]) => this.scene.remove(...objects);

    // TODO: Revisit a better disposing solution
    public dispose = () => {
        this.scene.traverse((obj) => {
            if (!obj) {
                return;
            }

            if (isRenderItem(obj)) {
                if (obj.geometry) {
                    obj.geometry.dispose();
                }
                disposeMaterial(obj);
            }

            // if we remove children in the same tick then we can't continue traversing,
            // so we defer to the next microtask
            Promise.resolve().then(() => {
                obj.parent && obj.parent.remove(obj);
            });
        });
    };
}
