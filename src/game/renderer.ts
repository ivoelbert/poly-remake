import * as THREE from 'three';

export class PolyRenderer {
    private renderer: THREE.WebGLRenderer;

    constructor() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.toneMappingExposure = Math.pow(1.01, 4.0);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
    }

    public getRenderer = (): THREE.WebGLRenderer => {
        return this.renderer;
    };

    public getDomElement = (): HTMLCanvasElement => {
        return this.renderer.domElement;
    };

    public resize = (): void => {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
}
