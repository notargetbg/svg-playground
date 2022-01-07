import React, { Children, useRef } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { randomIntFromInterval, useInterval } from '../../app/utils';
import SnakeGame from './snake/Snake';

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

const calculateGaps = (blocksCountV, blocksCountH) => {
    return {
        vGap: Math.ceil(width / blocksCountV),
        hGap : Math.ceil(height / blocksCountH),
    }
}

const GameBoard = ({ gameName }) => {
    const blocksCountV = 20;
    const blocksCountH = 20;
    const blocksH = new Array(blocksCountH + 1).fill('block');
    const blocksV = new Array(blocksCountV + 1).fill('block');

    const { vGap , hGap } = calculateGaps(blocksCountV, blocksCountH);
    const [isRunning, setIsRunning] = useState(true); 

    const endGame = () => {
        setIsRunning(false);
    };

    const toggleGameState = () => {
        isRunning ? setIsRunning(false) : setIsRunning(true);
    };

    return (
        <div style={{ height, width }} className={`game-wrapper ${gameName.toLowerCase()}`}
            tabIndex="0"
        >
            <div className='game-actions'>
                <button onClick={() => toggleGameState()}>{isRunning ? 'Pause' : 'Resume'}</button>
            </div>
            <SnakeGame vGap={vGap} hGap={hGap} blocksCount={blocksCountV} endGame={endGame} isRunning={isRunning}>
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