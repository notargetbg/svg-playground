import React from 'react';
// import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import Draggable from './features/draggable/Draggable';
import './App.css';
import GameBoard from './features/game/GameBoard/GameBoard';
import { GamesProvider } from './features/game/GameBoard/GameBoard.data';

function App() {
  return (
    <div className="App">
      <GamesProvider>
        <GameBoard />
      </GamesProvider>      
    </div>
  );
}

export default App;
