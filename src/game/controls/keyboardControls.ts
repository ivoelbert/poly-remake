import { isNil } from '../utils';
import { Movements, MoveState, getIdleMoveState, PolyControls } from './polyControls';

/**
 * PolyControls.
 *
 * This module takes care of binding keys to movements
 * and exposing an object that represents the current input
 * abstracted away from the actual keys that are being pressed
 */

// Map movements to key 'code'
export type KeyMapping = Map<string, Movements>;

// Default key binding
export const getDefaultKeyMapping = (): KeyMapping => {
    const keyMapping = new Map();
    keyMapping.set('KeyW', Movements.up);
    keyMapping.set('KeyS', Movements.down);
    keyMapping.set('KeyA', Movements.left);
    keyMapping.set('KeyD', Movements.right);
    keyMapping.set('KeyI', Movements.forwards);
    keyMapping.set('KeyK', Movements.backwards);
    keyMapping.set('KeyJ', Movements.rollLeft);
    keyMapping.set('KeyL', Movements.rollRight);
    keyMapping.set('Space', Movements.shoot);

    return keyMapping;
};

export class KeyboardControls implements PolyControls {
    public moveState: MoveState;
    private keyMapping: KeyMapping;

    constructor() {
        this.moveState = getIdleMoveState();
        this.keyMapping = getDefaultKeyMapping();
    }

    // When binding a key reset the moveState to avoid locking buttons.
    public bindKey = (key: string, movement: Movements): void => {
        this.keyMapping.set(key, movement);
        this.moveState = getIdleMoveState();
    };

    public attachListeners = (): void => {
        window.addEventListener('keydown', this.keyDownHandler);
        window.addEventListener('keyup', this.keyUpHandler);
    };

    public dispose = (): void => {
        window.addEventListener('keydown', this.keyDownHandler);
        window.addEventListener('keyup', this.keyUpHandler);
    };

    private keyDownHandler = (e: KeyboardEvent): void => {
        const movement = this.keyMapping.get(e.code);

        if (isNil(movement)) {
            return;
        }

        this.moveState[movement] = 1;
    };

    private keyUpHandler = (e: KeyboardEvent): void => {
        const movement = this.keyMapping.get(e.code);

        if (isNil(movement)) {
            return;
        }

        this.moveState[movement] = 0;
    };
}
