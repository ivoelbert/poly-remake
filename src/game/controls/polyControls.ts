import { MathUtils } from '../utils/utils';

// All posible inputs
export enum Movements {
    up = 'up',
    down = 'down',
    left = 'left',
    right = 'right',
    forwards = 'forwards',
    backwards = 'backwards',
    rollLeft = 'rollLeft',
    rollRight = 'rollRight',
    shoot = 'shoot',
}

/**
 * for each possible movement we have a number in [0, 1] instead of a boolean
 * so we can support analog input
 */
export type MoveState = Record<Movements, number>;

export const getIdleMoveState = (): MoveState => ({
    [Movements.up]: 0,
    [Movements.down]: 0,
    [Movements.left]: 0,
    [Movements.right]: 0,
    [Movements.forwards]: 0,
    [Movements.backwards]: 0,
    [Movements.rollLeft]: 0,
    [Movements.rollRight]: 0,
    [Movements.shoot]: 0,
});

export const lerpMoveStates = (
    moveState1: MoveState,
    moveState2: MoveState,
    factor: number
): MoveState => ({
    [Movements.up]: MathUtils.lerp(moveState1[Movements.up], moveState2[Movements.up], factor),
    [Movements.down]: MathUtils.lerp(
        moveState1[Movements.down],
        moveState2[Movements.down],
        factor
    ),
    [Movements.left]: MathUtils.lerp(
        moveState1[Movements.left],
        moveState2[Movements.left],
        factor
    ),
    [Movements.right]: MathUtils.lerp(
        moveState1[Movements.right],
        moveState2[Movements.right],
        factor
    ),
    [Movements.forwards]: MathUtils.lerp(
        moveState1[Movements.forwards],
        moveState2[Movements.forwards],
        factor
    ),
    [Movements.backwards]: MathUtils.lerp(
        moveState1[Movements.backwards],
        moveState2[Movements.backwards],
        factor
    ),
    [Movements.rollLeft]: MathUtils.lerp(
        moveState1[Movements.rollLeft],
        moveState2[Movements.rollLeft],
        factor
    ),
    [Movements.rollRight]: MathUtils.lerp(
        moveState1[Movements.rollRight],
        moveState2[Movements.rollRight],
        factor
    ),
    [Movements.shoot]: moveState2[Movements.shoot],
});

// All controls must expost a move state
export interface PolyControls {
    moveState: MoveState;
}
