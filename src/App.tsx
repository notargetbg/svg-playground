import React from 'react';
// import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import Draggable from './features/draggable/Draggable';
import './App.css';
import GameBoard from './features/game/GameBoard/GameBoard';
import { GamesProvider } from './features/game/GameBoard/GameBoard.data';
import { PromptProvider } from './features/game/hooks/PromptContext';

function App() {
  return (
    <div className="App">
      <GamesProvider>
        <PromptProvider>
          <GameBoard />
        </PromptProvider>
      </GamesProvider>      
    </div>
  );
}

export default App;
