import * as Tone from 'tone';
import { noop } from './utils/utils';

export interface SoundManager {
    playShot(): void;
    playPickup(): void;
    dispose(): void;
}

export class SilentSoundManager implements SoundManager {
    playShot = noop;
    playPickup = noop;
    dispose = noop;
}

export class ToneSoundManager implements SoundManager {
    private synth: Tone.Synth;

    constructor() {
        this.synth = new Tone.Synth().toDestination();
    }

    playShot = () => {
        const now = Tone.now();
        this.synth.triggerAttackRelease('G1', '32n', now);
    };

    playPickup = () => {
        const now = Tone.now();
        this.synth.triggerAttackRelease('C5', '32n', now);
        this.synth.triggerAttackRelease('E5', '32n', now + 0.05);
        this.synth.triggerAttackRelease('G5', '32n', now + 0.1);
    };

    dispose = () => {
        this.synth.dispose();
    };
}
