export type DropFunction<T> = (object: T) => void;

export interface Manager<T> {
    spawn: (...params: any[]) => void;
    drop: DropFunction<T>;
    update: () => void;
    dispose: () => void;
}
