import * as THREE from 'three';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';

const BLOOM_PARAMS = {
    exposure: 1.1,
    bloomStrength: 1.2,
    bloomThreshold: 0,
    bloomRadius: 0,
};

export class PolyRenderer {
    private renderer: THREE.WebGLRenderer;
    private composer: EffectComposer;

    constructor(scene: THREE.Scene, camera: THREE.Camera) {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.toneMappingExposure = Math.pow(BLOOM_PARAMS.exposure, 4.0);

        const renderScene = new RenderPass(scene, camera);

        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloomPass.threshold = BLOOM_PARAMS.bloomThreshold;
        bloomPass.strength = BLOOM_PARAMS.bloomStrength;
        bloomPass.radius = BLOOM_PARAMS.bloomRadius;

        this.composer = new EffectComposer(this.renderer);
        this.composer.renderToScreen = false;
        this.composer.addPass(renderScene);
        this.composer.addPass(bloomPass);

        this.composer.renderToScreen = true;
    }

    public getDomElement = (): HTMLCanvasElement => {
        return this.renderer.domElement;
    };

    public resize = (): void => {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    };

    public render = (): void => {
        this.composer.render();
    };
}
