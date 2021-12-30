import React, { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { randomIntFromInterval, useInterval } from '../../app/utils';

const GameBoard = () => {
    const playerColor = '#473dbd';
    const foodColor = 'red';
    const blocksCount = 20;
    const [isRunning, setIsRunning] = useState(true);
    const [delay, setDelay] = useState(200);
    const blocks = new Array(blocksCount + 1).fill('block');
    const gameEl = useRef();
    const [playerPosition, setPosition] = useState({x: 0, y: 0, direction: 'right', stepCount: 0, turnPosition: { x: 0, y: 0 }});
    const [hGap, setHorizontalGap] = useState(0);
    const [vGap, setVerticalGap] = useState(0);
    const randPosX = vGap * randomIntFromInterval(1, blocksCount - 1);
    const randPosY = hGap * randomIntFromInterval(1, blocksCount - 1);
    const [snakeFood, setSnakeFood] = useState({x: randPosX, y: randPosY});
    const [foodBlocksEaten, setFoodBlocksEaten] = useState([]);

    const isSnakeEating = snakeFood.x === playerPosition.x &&
                            snakeFood.y === playerPosition.y;

    useEffect(() => {
        if (isSnakeEating) {
            console.log('setting')
            setFoodBlocksEaten(prevState => {
                return [...prevState, {
                    x: playerPosition.x,
                    y: playerPosition.y
                }];
            });
        }
        setSnakeFood({
            x: vGap * randomIntFromInterval(1, blocksCount - 1),
            y: hGap * randomIntFromInterval(1, blocksCount - 1)
        });
        
    }, [isSnakeEating]);

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
        // console.log('move snake', seconds, snakeFood);
        const stepCount = foodBlocksEaten.length >= playerPosition.stepCount ?
            playerPosition.stepCount + 1 :
            playerPosition.stepCount;

        if (playerPosition.direction === 'left') {
            if (playerPosition.x === 0) {
                endGame();
                return;
            };

            setPosition({
                ...playerPosition,
                x: playerPosition.x - hGap,
                stepCount: stepCount
            });

            // setFoodBlocksEaten(foodBlocksEaten.map((item, i) => {
            //     return {
            //      x: playerPosition.x + ((i + stepCount) * hGap),
            //      y: playerPosition.y - (stepCount) * hGap
            //     }
            // }));
        }

        if (playerPosition.direction === 'right') {
            if (playerPosition.x >= (blocksCount * hGap) - hGap) {
                endGame();
                return;
            };

            setPosition({
                ...playerPosition,
                x: playerPosition.x + hGap,
                stepCount: stepCount
            });

            // setFoodBlocksEaten(foodBlocksEaten.map((item, i) => {
            //     return {
            //      x: playerPosition.x - ((i + stepCount) * hGap),
            //      y: playerPosition.y
            //     }
            //  }));
        }

        if (playerPosition.direction === 'top') {
            if (playerPosition.y === 0) {
                endGame();
                return;
            };

            setPosition({
                ...playerPosition,
                y: playerPosition.y - vGap,
                stepCount: stepCount
            });

            // setFoodBlocksEaten(foodBlocksEaten.map((item, i) => {
            //     return {
            //      x: playerPosition.x,
            //      y: playerPosition.y + (i * vGap)
            //     }
            // }));
        }

        if (playerPosition.direction === 'bottom') {
            if (playerPosition.y >= (blocksCount * vGap) - vGap) {
                endGame();
                return;
            };

            setPosition({
                ...playerPosition,
                y: playerPosition.y + vGap,
                stepCount: stepCount
            });

            // setFoodBlocksEaten(foodBlocksEaten.map((item, i) => {
            //     return {
            //      x: playerPosition.x,
            //      y: playerPosition.y - (i  * vGap)
            //     }
            // }));
        }

        setFoodBlocksEaten([{ x: playerPosition.x, y: playerPosition.y }, ...foodBlocksEaten.slice(0, -1)]);
    }, isRunning ? delay : null);

    const turnPosition = {
        x: playerPosition.x,
        y: playerPosition.y
    };

    const move = () => (e) => {        
        if (!isRunning) {
            console.log('game ended!')
            return;
        }

        if (e.key === 'a') {
            if (playerPosition.x === 0) return;

            setPosition({
                ...playerPosition,
                turnPosition,
                // x: playerPosition.x - hGap,
                direction: 'left',
                stepCount: 0
            });
        }

        if (e.key === 'd') {
            if (playerPosition.x >= (blocksCount * hGap) - hGap) return;

            setPosition({
                ...playerPosition,
                turnPosition,
                // x: playerPosition.x + hGap,
                direction: 'right',
                stepCount: 0
            });
        }

        if (e.key === 'w') {
            if (playerPosition.y === 0) return;

            setPosition({
                ...playerPosition,
                turnPosition,
                // y: playerPosition.y - vGap,
                direction: 'top',
                stepCount: 0
            });
        }

        if (e.key === 's') {
            if (playerPosition.y >= (blocksCount * vGap) - vGap) return;

            setPosition({
                ...playerPosition,
                turnPosition,
                // y: playerPosition.y + vGap,
                direction: 'bottom',
                stepCount: 0
            });
        }

    };

    const toggleGameState = () => {
        isRunning ? setIsRunning(false) : setIsRunning(true);
    };

    return (
        <div className='game-wrapper'
            tabIndex="0"
            onKeyDown={move()}
        >
            <div className='game-actions'>
                <button onClick={() => toggleGameState()}>{isRunning ? 'Pause' : 'Resume'}</button>
            </div>
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
                    {foodBlocksEaten.map((block, i) => {
                        {/* let x, y;

                        if (playerPosition.direction === 'top') {
                            x = playerPosition.x
                            y = playerPosition.y + (hGap * (i + 1))
                        }

                        if (playerPosition.direction === 'bottom') {
                            x = playerPosition.x
                            y = playerPosition.y - (hGap * (i + 1)) 
                        }

                        if (playerPosition.direction === 'left') {
                            x = playerPosition.x + (vGap * (i + 1)) 
                            y = playerPosition.y
                        }

                        if (playerPosition.direction === 'right') {
                            x = playerPosition.x - (vGap * (i + 1)) 
                            y = playerPosition.y
                        } */}

                        return <rect
                            fill={playerColor}
                            opacity={0.6}
                            x={block.x}
                            y={block.y} 
                            width={vGap}
                            height={hGap}
                            rx="2">
                            food
                        </rect>
                    })};
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