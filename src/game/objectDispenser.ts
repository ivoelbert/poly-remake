export interface ObjectDispenser<T> {
    addObject: (object: T) => void;
    getOne: () => T;
    dropOne: (object: T) => void;
    update: () => void;
    dispose: () => void;
}
