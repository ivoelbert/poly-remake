import { PolyObject } from './objects/polyObject';

export enum Groups {
    asteroids,
    ship,
    shots,
    missiles,
    center,
}

interface Collider {
    addRule: (g1: Groups, g2: Groups) => void;
    addObjectToGroup: (obj: PolyObject, group: Groups) => void;
    removeObjectFromGroup: (obj: PolyObject, group: Groups) => void;
    update: () => void;
}

type ColliderGroups = Record<Groups, Set<PolyObject>>;

export class PolyCollider implements Collider {
    private rules: Set<[Groups, Groups]>;
    private groups: ColliderGroups;

    constructor() {
        this.rules = new Set();
        this.groups = {
            [Groups.asteroids]: new Set(),
            [Groups.ship]: new Set(),
            [Groups.shots]: new Set(),
            [Groups.missiles]: new Set(),
            [Groups.center]: new Set(),
        };
    }

    addRule = (g1: Groups, g2: Groups): void => {
        this.rules.add([g1, g2]);
    };

    addObjectToGroup = (obj: PolyObject, group: Groups): void => {
        this.groups[group].add(obj);
    };

    removeObjectFromGroup = (obj: PolyObject, group: Groups): void => {
        this.groups[group].delete(obj);
    };

    update = (): void => {
        this.rules.forEach(([g1, g2]) => {
            this.groups[g1].forEach((o1) => {
                this.groups[g2].forEach((o2) => {
                    if (polyObjectsCollide(o1, o2)) {
                        o1.onCollide?.(o2);
                        o2.onCollide?.(o1);
                    }
                });
            });
        });
    };
}

const polyObjectsCollide = (o1: PolyObject, o2: PolyObject): boolean => {
    return o1.hitbox.intersects(o2.hitbox);
};
