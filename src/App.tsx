import React from 'react';
import GameCanvas from './components/GameCanvas';

function App() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#000000'
    }}>
      <GameCanvas />
    </div>
  );
}

export default App;
