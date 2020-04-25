import React from 'react';
import './App.scss';
import { usePolybius } from './hooks/usePolybius';

function App() {
    const polybiusRef = usePolybius();

    return <div className="App" ref={polybiusRef} />;
}

export default App;
