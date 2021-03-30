import React, { useState } from 'react';
import { usePolybius } from './hooks/usePolybius';
import './App.scss';

export function App() {
    const [isPlaying, setIsPlaying] = useState(false);
    const startGame = () => {
        setIsPlaying(true);
    };

    if (isPlaying) {
        return <Game />;
    }

    return <StartScreen startGame={startGame} />;
}

function Game() {
    const polybiusRef = usePolybius();

    return <div className="game-container" ref={polybiusRef} />;
}

interface StartScreenProps {
    startGame(): void;
}

function StartScreen(props: StartScreenProps) {
    return (
        <div className="start-screen">
            <button onClick={props.startGame}>Start</button>
        </div>
    );
}
