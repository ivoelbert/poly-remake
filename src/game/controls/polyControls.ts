
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

// All controls must expost a move state
export interface PolyControls {
    moveState: MoveState;
}
