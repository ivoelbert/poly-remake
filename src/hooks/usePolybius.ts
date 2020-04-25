import { useEffect } from 'react';
import { Polybius } from '../game/polybius';
import { assertExists } from '../game/utils';

const polybius = new Polybius();

type CallbackRef = (element: HTMLElement | null) => void;

export const usePolybius = (): CallbackRef => {
    useEffect(() => {
        polybius.attachListeners();

        return () => polybius.dispose();
    }, []);

    const callbackRef = (element: HTMLElement | null): void => {
        assertExists(element).appendChild(polybius.getDomElement());
    };

    return callbackRef;
};
