import React, { useRef } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { randomIntFromInterval, useInterval } from '../../app/utils';
import SnakeGame from './Snake/Snake';
import { updateGameField, useGamesDispatch, useGamesState } from './GameBoard.data';
import GridGameboard from './GameBoard/GridGameboard';

/* 
    Game is working! Wohoo
    Todos:
    - add leveling system
    - add game over conditions ( when snek eats itself )
    - add rules not to spawn food on snek body
    - add leaderboard
    - build and deploy
    - add configuration
*/

const width = 400;
const height = 400;

const calculateGaps = (blocksCountV: number, blocksCountH: number) => {
    return {
        vGap: Math.ceil(width / blocksCountV),
        hGap : Math.ceil(height / blocksCountH),
    }
}

// on restart
// show on screen message
// get ready ...
// hunt!

let restartTimeout = null;

interface GameBoardProps {
    gameName: string;
}

type GameRef = { 
    domRef: { 
        current: { focus: () => void } 
    },
    resetGame: () => void ,
    getGameState: () => { playerPosition: number[], snakeFood: number[], delay: number },
    loadGame: () => void
}

const GameBoard = ({ gameName }: GameBoardProps) => {
    const { gameBoards, activeGame, isRunning, statusMessage, score } = useGamesState();
    const gameRef = useRef<GameRef | null>(null);
    const dispatch = useGamesDispatch();
    
    // todo: make dynamic and animate snake movement smoothly
    const { blocksCountH, blocksCountV, blocksH, blocksV } = gameBoards[activeGame.toLowerCase()];
    const { vGap , hGap } = calculateGaps(blocksCountV, blocksCountH);

    useEffect(() => {
        if (!gameRef.current) return;
        gameRef.current.domRef.current.focus();
    }, []);

    const handleSetScore = (scoreIncrement: number) => {
        dispatch(updateGameField('score', score + scoreIncrement));
    }

    const handleRestartGame = useCallback(() => {
        dispatch({ type: 'TOGGLE_PAUSE_GAME' });
        try {
            if (!gameRef.current) return;

            gameRef.current.resetGame();
            dispatch(updateGameField('score', 0));
            restartTimeout = setTimeout(() => {
                dispatch(updateGameField('statusMessage', 'GET READY ...'));
            }, 0);
            restartTimeout = setTimeout(() => {
                dispatch(updateGameField('statusMessage', 'HUNT!'));
                dispatch({ type: 'TOGGLE_PAUSE_GAME' });
            }, 1500);
            dispatch(updateGameField('statusMessage', 'SNAKE'));

            gameRef.current.domRef.current.focus()
        } catch (error) {
            console.log(error);
        }
    }, [dispatch]);
    
    const handleSaveGame = useCallback(() => {
        if (!gameRef.current) return;

        const { playerPosition, snakeFood, delay } = gameRef.current.getGameState();

        dispatch({ type: 'SAVE_GAME', payload: { gameName: activeGame, score } });

        localStorage.setItem('snake-game', JSON.stringify({
            playerPosition,
            snakeFood,
            delay,
            score
        }));     

    }, [score, activeGame, dispatch, gameRef]);

    const handleLoadGame = useCallback(() => {
        if (!gameRef.current) return;
        dispatch({ type: 'LOAD_GAME', payload: { gameName: activeGame } });
        dispatch(updateGameField('statusMessage', 'LOADING GAME ...'));
        gameRef.current.loadGame();
    }, [activeGame, dispatch]);

    const handleTogglePauseGame = useCallback(() => {
        dispatch({ type: 'TOGGLE_PAUSE_GAME' });
    }, [dispatch]);

    const handleEndGame = () => {
        dispatch('END_GAME');
    };

    return (
        <div style={{ height, width }} className={`game-wrapper ${gameName.toLowerCase()}`}
            tabIndex={0}
        >
            <div className='menu'>
                <h1>Snake</h1>
                <div className='game-actions'>
                    <strong>High score:</strong> {score}

                    <button onClick={() => handleSaveGame()}>Save game</button>
                    <button style={{marginRight: 10}} onClick={() => handleLoadGame()}>Load game</button> <br />
                    
                    <div style={{marginTop: 4}}>
                        <button onClick={() => handleTogglePauseGame()}>{isRunning ? 'Pause' : 'Resume'}</button>
                        <button style={{marginRight: 10}} onClick={() => handleRestartGame()}>Restart game</button> <br />
                    </div>
                    
                </div>


            </div>
            {statusMessage && <h3>{statusMessage}</h3>}
            {/**
             * Part 1. Add the ability to save and load the game
             * Part 2. Add the ability to play the game on network
             * Part 3. Add the ability to play the game with AI, train a model to play the game versus human
             * Part 4. Add the ability to play the game with friends by loading another game on the same screen
             */}
            <SnakeGame 
                vGap={vGap} 
                hGap={hGap} 
                blocksCount={blocksCountV} 
                endGame={handleEndGame} 
                isRunning={isRunning} 
                score={score} 
                setScore={handleSetScore} 
                ref={gameRef}
            >
                <GridGameboard blocksH={blocksH} blocksV={blocksV} vGap={vGap} hGap={hGap} />
            </SnakeGame>
        </div>
    );   
}

export default GameBoard;