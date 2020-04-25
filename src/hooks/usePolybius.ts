import { useEffect } from 'react';
import { Polybius } from '../game/polybius';
import { assertExists } from '../game/utils';

const polybius = new Polybius();

type CallbackRef = (element: HTMLElement | null) => void;

export const usePolybius = (): CallbackRef => {
    useEffect(() => {
        window.addEventListener('resize', polybius.resize);

        return () => window.removeEventListener('resize', polybius.resize);
    }, []);

    const callbackRef = (element: HTMLElement | null): void => {
        assertExists(element).appendChild(polybius.getDomElement());
    };

    return callbackRef;
};
