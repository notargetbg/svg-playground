import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import Draggable from './features/draggable/Draggable';
import './App.css';
import GameBoard from './features/game/GameBoard';

function App() {
  return (
    <div className="App">
      <GameBoard gameName='snake' />
    </div>
  );
}

export default App;
