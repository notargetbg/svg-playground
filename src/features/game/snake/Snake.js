import React, { useRef } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { randomIntFromInterval, useInterval } from '../../app/utils';

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

const calculateGaps = (gameEl, blocksCount) => {
    // try to reduce calls ?
    // console.log(gameEl)
    if (!gameEl || !gameEl.current) return {
        hGap: 0,
        vGap: 0
    };

    return {
        hGap : Math.ceil(gameEl.current.clientHeight / blocksCount),
        vGap: Math.ceil(gameEl.current.clientWidth / blocksCount)
    }
}

const GameBoard = () => {
    const playerColor = '#473dbd';
    const foodColor = 'red';
    const blocksCount = 20;
    const [isRunning, setIsRunning] = useState(true);
    const [delay, setDelay] = useState(200);
    const blocks = new Array(blocksCount + 1).fill('block');
    const gameEl = useRef();
    const [playerPosition, setPosition] = useState({x: 0, y: 0, direction: 'right', stepCount: 0});
    const { vGap , hGap } = calculateGaps(gameEl, blocksCount);
    const randPosX = vGap * randomIntFromInterval(1, blocksCount - 1);
    const randPosY = hGap * randomIntFromInterval(1, blocksCount - 1);
    const [snakeFood, setSnakeFood] = useState({x: randPosX, y: randPosY});
    const [foodBlocksEaten, setFoodBlocksEaten] = useState([]);

    const isSnakeEating = snakeFood && (snakeFood.x === playerPosition.x &&
        snakeFood.y === playerPosition.y);

        // compare in different way look at x and y same time for each position!
    const createFoodOutsideSnake = useCallback((pPos, vg, hg) => {
        let x = vg * randomIntFromInterval(1, blocksCount - 1);
        let y = hg * randomIntFromInterval(1, blocksCount - 1);

        const allBlocks = [{ x: pPos.x, y: pPos.y }, ...foodBlocksEaten];
        const isInBody = allBlocks.some(block => {
            return block.x === x && block.y === y;
        });

        while (isInBody) {
            const newX = vg * randomIntFromInterval(1, blocksCount - 1);
            const newY = hg * randomIntFromInterval(1, blocksCount - 1);

            // if ((x !== pPos.x && y !== pPos.y) && (isInBodyX && !isInBodyY)) {
                // break;
            // }

            const isInBody = allBlocks.some(block => {
                return block.x === newX && block.y === newY;
            });            

            if (!isInBody) {
                console.log('not in body!')
                x = newX;
                y = newY;
                
                break;
            }

            x = newX;
            y = newY;
        }

        return { x, y }
    }, [foodBlocksEaten, blocksCount]);

    useEffect(() => {
        // setHorizontalGap(Math.ceil(gameEl.current.clientHeight / blocksCount));
        // setVerticalGap(Math.ceil(gameEl.current.clientWidth / blocksCount));
    }, [gameEl]);

    // Todo: fix this
    useEffect(() => {
        if (isSnakeEating) {
            console.log('eating')
            setFoodBlocksEaten((prevState) => {
                return [...prevState, {
                    x: playerPosition.x,
                    y: playerPosition.y
                }];
            });

            const gaps = calculateGaps(gameEl, blocksCount);
            const { x, y } = createFoodOutsideSnake(playerPosition, gaps.vGap, gaps.hGap);

            setSnakeFood({ x, y });
        }
        
    }, [isSnakeEating, gameEl, playerPosition, createFoodOutsideSnake]);

    useInterval(() => {
         const { x, y } =  createFoodOutsideSnake(playerPosition, vGap, hGap);

        setSnakeFood({ x, y });
    }, isRunning ? 3500 : null);

    const endGame = () => {
        setIsRunning(false);
    };

    // main game loop
    useInterval(() => {
        const stepCount = foodBlocksEaten.length >= playerPosition.stepCount ?
            playerPosition.stepCount + 1 :
            playerPosition.stepCount;

        // set at the same time

        setFoodBlocksEaten([{ x: playerPosition.x, y: playerPosition.y }, ...foodBlocksEaten.slice(0, -1)]);

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
        }
    }, isRunning ? delay : null);

    const move = () => (e) => {        
        if (!isRunning) {
            console.log('game ended!')
            return;
        }

        if (e.key === 'a') {
            const outOfBounds = playerPosition.x === 0;
            if (outOfBounds || playerPosition.direction === 'right') return;

            setPosition({
                ...playerPosition,
                // x: playerPosition.x - hGap,
                direction: 'left',
                stepCount: 0
            });
        }

        if (e.key === 'd') {
            const outOfBounds = (playerPosition.x >= (blocksCount * hGap) - hGap);
            if (outOfBounds || playerPosition.direction === 'left') return;

            setPosition({
                ...playerPosition,
                // x: playerPosition.x + hGap,
                direction: 'right',
                stepCount: 0
            });
        }

        if (e.key === 'w') {
            const outOfBounds = playerPosition.y === 0;
            if (outOfBounds || playerPosition.direction === 'bottom') return;

            setPosition({
                ...playerPosition,
                // y: playerPosition.y - vGap,
                direction: 'top',
                stepCount: 0
            });
        }

        if (e.key === 's') {
            const outOfBounds = (playerPosition.y >= (blocksCount * vGap) - vGap);
            if (outOfBounds || playerPosition.direction === 'top') return;

            setPosition({
                ...playerPosition,
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
                    {snakeFood &&
                        <rect
                            fill={foodColor}
                            x={snakeFood.x}
                            y={snakeFood.y} 
                            width={vGap}
                            height={hGap}
                            rx="2"
                        >
                            food
                        </rect>
                    }
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