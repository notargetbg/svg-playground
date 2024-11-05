import React, { useRef } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { randomIntFromInterval, useInterval } from '../../app/utils';
import SnakeGame from './snake/Snake';
import { useGamesState } from './GameBoard.data';

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
    resetGame: () => void 
}

const GameBoard = ({ gameName }: GameBoardProps) => {
    const { gameBoards, activeGame } = useGamesState();
    const dispatchGame
    console.log(gameBoards);
    

    const { blocksCountH, blocksCountV, blocksH, blocksV } = gameBoards[activeGame.toLowerCase()];
    const [message, setMessage] = useState('GAME RUNNING');
    const gameRef = useRef<GameRef | null>(null);

    // console.log(blocksCountH, blocksCountV, blocksH, blocksV);

    useEffect(() => {
        if (!gameRef.current) return;
        gameRef.current.domRef.current.focus();
    }, []);

    const { vGap , hGap } = calculateGaps(blocksCountV, blocksCountH);
    const [isRunning, setIsRunning] = useState(true); 

    const endGame = () => {
        setIsRunning(false);
    };

    const toggleGameState = () => {
        isRunning ? setIsRunning(false) : setIsRunning(true);
    };

    const [score, setScore] = useState(0);

    const handleSetScore = (score: number) => {
        setScore((prevScore => {
            return prevScore + score;
        }));
    }

    const handleRestart = () => {
        setIsRunning(false);
        try {
            if (!gameRef.current) return;

            gameRef.current.resetGame();
            restartTimeout = setTimeout(() => {
                
                setMessage('GET READY...')
            }, 0);
            restartTimeout = setTimeout(() => {
                setMessage('HUNT!');
                setIsRunning(true)
            }, 1500);
            setMessage('SNAKE');

            gameRef.current.domRef.current.focus()
        } catch (error) {
            console.log(error);
        }
    }   

    return (
        <div style={{ height, width }} className={`game-wrapper ${gameName.toLowerCase()}`}
            tabIndex={0}
        >

            <div className='menu'>
                <h1>Snake</h1>
                <div className='game-actions'>
                    <strong>High score:</strong> {score}

                    <button  onClick={() => toggleGameState()}>{isRunning ? 'Pause' : 'Resume'}</button>
                    <button onClick={() => handleRestart()} style={{marginRight: 10}}>Restart game</button>
                </div>


            </div>
            {message && <h3>{message}</h3>}
            <SnakeGame vGap={vGap} hGap={hGap} blocksCount={blocksCountV} endGame={endGame} isRunning={isRunning} score={score} setScore={handleSetScore} ref={gameRef}>
                <g className='horizontal-lines'>
                    {blocksH.map((block, i) => {
                        //  x1="0" y1="0" x2="100%" stroke="red" y2="0"
                        return <line

                            key={`item-${i}`}
                            stroke='#274dc9'
                            // stroke-width="1"
                            x1={(vGap * i)}
                            x2={(vGap * i)}
                            y1={0}
                            y2='100%'
                        />
                    })}
                </g>

                <g className='vertical-lines'>
                    {blocksV.map((block, i) => {
                        return <line 
                            key={`item-${i}`}
                            stroke='#274dc9'
                            // stroke-width="1"
                            x1={0}
                            x2='100%'
                            y1={(hGap * i)}
                            y2={(hGap * i)}
                        />
                    })}

                </g>
            </SnakeGame>
        </div>
    );   
}

export default GameBoard;