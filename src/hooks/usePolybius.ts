import { useEffect } from 'react';
import { Polybius } from '../game/polybius';
import { assertExists } from '../game/utils/utils';
import { useLazyRef } from './useLazyRef';

type CallbackRef = (element: HTMLElement | null) => void;

export const usePolybius = (): CallbackRef => {
    const polybius = useLazyRef(() => new Polybius());

    useEffect(() => {
        polybius.start();

        return () => polybius.dispose();
    }, [polybius]);

    const callbackRef = (element: HTMLElement | null): void => {
        assertExists(element).appendChild(polybius.getDomElement());
    };

    return callbackRef;
};
