import { CancelAction, VoidCallback } from '../utils/utils';

export class Scheduler {
    static after = (ms: number, cb: VoidCallback): CancelAction => {
        const timeoutId = setTimeout(cb, ms);

        return () => {
            clearTimeout(timeoutId);
        };
    };
}
