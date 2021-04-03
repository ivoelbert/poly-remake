import * as React from 'react';
import { usePolybius } from './hooks/usePolybius';

function GameComponent() {
    const polybiusRef = usePolybius();

    return <div className="game-container" ref={polybiusRef} />;
}

export default GameComponent;
