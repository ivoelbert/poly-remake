import * as THREE from 'three';

export class PolyScene {
    public readonly scene: THREE.Scene;
    private static instance: PolyScene;

    private constructor() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x000000, 0.000025);

        const light = new THREE.AmbientLight(0xffffff);
        this.scene.add(light);
    }

    static getInstance = (): PolyScene => {
        if (!PolyScene.instance) {
            PolyScene.instance = new PolyScene();
        }

        return PolyScene.instance;
    };

    public add = (...objects: THREE.Object3D[]) => this.scene.add(...objects);

    public remove = (...objects: THREE.Object3D[]) =>
        this.scene.remove(...objects);

    public dispose = () => this.scene.dispose();
}
