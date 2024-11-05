import React from 'react';
// import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import Draggable from './features/draggable/Draggable';
import './App.css';
import GameBoard from './features/game/GameBoard';
import { GamesProvider } from './features/game/GameBoard.data';

function App() {
  return (
    <div className="App">
      <GamesProvider>
        <GameBoard gameName='snake' />
      </GamesProvider>      
    </div>
  );
}

export default App;
