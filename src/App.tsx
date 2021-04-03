import * as React from 'react';
import './App.scss';

const GameComponent = React.lazy(() => import('./GameComponent'));

export function App() {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const startGame = () => {
        setIsPlaying(true);
    };

    if (isPlaying) {
        return <Game />;
    }

    return <StartScreen startGame={startGame} />;
}

function LoadingScreen() {
    return <div className="start-screen">loading</div>;
}

function Game() {
    return (
        <React.Suspense fallback={<LoadingScreen />}>
            <GameComponent />
        </React.Suspense>
    );
}

interface StartScreenProps {
    startGame(): void;
}

function StartScreen(props: StartScreenProps) {
    const startGame = async () => {
        const deviceMotionEvent = DeviceMotionEvent as any;
        if (deviceMotionEvent && typeof deviceMotionEvent.requestPermission === 'function') {
            await deviceMotionEvent.requestPermission();
        }

        props.startGame();
    };

    return (
        <div className="start-screen">
            <button onClick={startGame}>Start</button>
        </div>
    );
}
