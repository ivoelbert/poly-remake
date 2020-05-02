import * as THREE from 'three';

export class PolyScene {
    private _scene: THREE.Scene;
    private static instance: PolyScene;

    private constructor() {

        this._scene = new THREE.Scene();
        this._scene.fog = new THREE.FogExp2(0x000000, 0.000025);

        const light = new THREE.AmbientLight(0xffffff);
        this._scene.add(light);
    }

    static getInstance = (): PolyScene => {
        if (!PolyScene.instance) {
            PolyScene.instance = new PolyScene();
        }

        return PolyScene.instance;
    };

    get scene(){
        return this._scene
    }

    public add = (...objects: THREE.Object3D[]) => this.scene.add(...objects)

    public remove = (...objects: THREE.Object3D[]) => this.scene.remove(...objects)

    public dispose = () => this.scene.dispose()
  
}
