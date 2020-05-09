import { ObjectDispenser } from '../../objectDispenser';
import { FollowMissile } from './followMissile';
import { PolyScene } from '../../scene/PolyScene';

import { isNil, getOne, getDumpster, assertExists } from '../../utils';

export class FollowMissileDispenser implements ObjectDispenser<FollowMissile> {
    private idleMissiles: Set<FollowMissile>;
    private liveMissiles: Set<FollowMissile>;
    private scene: PolyScene;

    constructor() {
        this.scene = PolyScene.getInstance();

        this.idleMissiles = new Set();
        this.liveMissiles = new Set();
    }

    public addObject = (object: FollowMissile) => {
        this.idleMissiles.add(object);
        this.scene.add(object.mesh);
    };

    public getOne = () => {
        const object = getOne(this.idleMissiles);
        if (isNil(object)) {
            // Blows up only if liveMissiles is empty (I think we never get there)
            const olderLiveObject = assertExists(getOne(this.liveMissiles));
            return olderLiveObject;
        } else {
            this.idleMissiles.delete(object);
            this.liveMissiles.add(object);
            return object;
        }
    };

    public dropOne = (objectToDelete: FollowMissile) => {
        objectToDelete.mesh.position.copy(getDumpster());
        this.liveMissiles.delete(objectToDelete);
        this.idleMissiles.add(objectToDelete);
    };

    public update = () => {
        this.liveMissiles.forEach((object) => object.update());
    };

    public dispose = () => {
        this.liveMissiles.forEach((object) => this.scene.remove(object.mesh));
        this.idleMissiles.forEach((object) => this.scene.remove(object.mesh));
    };
}
