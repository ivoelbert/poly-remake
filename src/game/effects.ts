import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { Scheduler } from './clock/scheduler';
import { PolyRenderer } from './renderer';
import { PolyScene } from './scene/PolyScene';
import { noop, VoidCallback } from './utils/utils';

export class EffectsManager {
    private composer: EffectComposer;
    private renderer: THREE.WebGLRenderer;

    private renderPass: RenderPass;
    private bloomPass: PolyBloom;
    private glitchPass: PolyGlitch;

    constructor(renderer: PolyRenderer, scene: PolyScene, camera: THREE.Camera) {
        this.renderer = renderer.getRenderer();

        this.renderPass = new RenderPass(scene.scene, camera);

        this.bloomPass = new PolyBloom();

        this.glitchPass = new PolyGlitch();

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(this.renderPass);
        this.composer.addPass(this.bloomPass);
        this.composer.addPass(this.glitchPass);
        this.composer.renderToScreen = true;
    }

    glitch = (): void => {
        this.glitchPass.trigger();
    };

    resize = (): void => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.renderPass.setSize(w, h);
        this.bloomPass.setSize(w, h);
        this.glitchPass.setSize(w, h);
        this.composer.setSize(w, h);
        this.renderer.setSize(w, h);
    };

    render = (): void => {
        this.composer.render();
    };
}

const BLOOM_PARAMS = {
    bloomStrength: 1.1,
    bloomThreshold: 0,
    bloomRadius: 0,
};

class PolyBloom extends UnrealBloomPass {
    constructor() {
        super(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            BLOOM_PARAMS.bloomStrength,
            BLOOM_PARAMS.bloomRadius,
            BLOOM_PARAMS.bloomThreshold
        );
    }
}

class PolyGlitch extends GlitchPass {
    private cancelGlitch: VoidCallback;

    constructor() {
        super();
        this.goWild = true;
        this.enabled = false;
        this.cancelGlitch = noop;
    }

    trigger = () => {
        this.cancelGlitch();

        this.enabled = true;
        this.cancelGlitch = Scheduler.after(750, () => {
            this.enabled = false;
        });
    };
}
