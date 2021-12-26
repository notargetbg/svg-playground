import React, { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { randomIntFromInterval, useInterval } from '../../app/utils';

const GameBoard = () => {
    const playerColor = '#473dbd';
    const foodColor = 'red';
    const blocksCount = 20;
    const [isRunning, setIsRunning] = useState(true);
    const [delay, setDelay] = useState(1000);
    const blocks = new Array(blocksCount + 1).fill('block');
    const gameEl = useRef();
    const [playerPosition, setPosition] = useState({x: 0, y: 0, direction: 'right' });
    const [hGap, setHorizontalGap] = useState(0);
    const [vGap, setVerticalGap] = useState(0);
    const randPosX = vGap * randomIntFromInterval(1, blocksCount - 1);
    const randPosY = hGap * randomIntFromInterval(1, blocksCount - 1);
    const [snakeFood, setSnakeFood] = useState({x: randPosX, y: randPosY});

    useEffect(() => {
        setHorizontalGap(Math.ceil(gameEl.current.clientHeight / blocksCount));
        setVerticalGap(Math.ceil(gameEl.current.clientWidth / blocksCount));
    }, [gameEl]);

    useInterval(() => {        
        setSnakeFood({
            x: randPosX,
            y: randPosY 
        });
    }, isRunning ? 3500 : null);

    const endGame = () => {
        setIsRunning(false);
    };
    // main game loop
    useInterval(() => {
        var seconds = new Date().getTime() / 1000;
        console.log('move snake', seconds, snakeFood);
        
        if (playerPosition.direction === 'left') {
            if (playerPosition.x === 0) {
                endGame();
                return;
            };


            setPosition({
                ...playerPosition,
                x: playerPosition.x - hGap,
            });
        }

        if (playerPosition.direction === 'right') {
            if (playerPosition.x >= (blocksCount * hGap) - hGap) {
                endGame();
                return;
            };

            setPosition({
                ...playerPosition,
                x: playerPosition.x + hGap,
            });
        }

        if (playerPosition.direction === 'top') {
            if (playerPosition.y === 0) {
                endGame();
                return;
            };

            setPosition({
                ...playerPosition,
                y: playerPosition.y - hGap,
            });
        }

        if (playerPosition.direction === 'bottom') {
            if (playerPosition.y >= (blocksCount * vGap) - vGap) {
                endGame();
                return;
            };

            setPosition({
                ...playerPosition,
                y: playerPosition.y + hGap,
            });
        }
    }, isRunning ? delay : null);

    const move = () => (e) => {        
        if (!isRunning) {
            console.log('game ended!')
            return;
        }


        if (e.key === 'a') {
            if (playerPosition.x === 0) return;

            setPosition({
                ...playerPosition,
                // x: playerPosition.x - hGap,
                direction: 'left'
            });
        }

        if (e.key === 'd') {
            if (playerPosition.x >= (blocksCount * hGap) - hGap) return;

            setPosition({
                ...playerPosition,
                // x: playerPosition.x + hGap,
                direction: 'right'
            });
        }

        if (e.key === 'w') {
            if (playerPosition.y === 0) return;

            setPosition({
                ...playerPosition,
                // y: playerPosition.y - vGap,
                direction: 'top'
            });
        }

        if (e.key === 's') {
            if (playerPosition.y >= (blocksCount * vGap) - vGap) return;

            setPosition({
                ...playerPosition,
                // y: playerPosition.y + vGap,
                direction: 'bottom'
            });
        }

    };



    return (
        <div className='game-wrapper'
            tabIndex="0"
            onKeyDown={move()}
        >
            <svg ref={gameEl}>
                <g className='player'>
                    <rect
                        fill={playerColor}
                        x={playerPosition.x}
                        y={playerPosition.y} 
                        width={vGap}
                        height={hGap}
                        rx="2"
                    >
                        x
                    </rect>
                </g>
                <g className='spawned-block'>
                    <rect
                        fill={foodColor}
                        x={snakeFood.x}d
                        y={snakeFood.y} 
                        width={vGap}
                        height={hGap}
                        rx="2"
                    >
                        food
                    </rect>
                </g>
                <g className='horizontal-lines'>
                    {blocks.map((block, i) => {
                        //  x1="0" y1="0" x2="100%" stroke="red" y2="0"
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

                <g className='vertical-lines'>
                    {blocks.map((block, i) => {
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
            </svg>
        </div>
    );   
}

export default GameBoard;