import React, { useRef } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { randomIntFromInterval, useInterval } from '../../../app/utils';
import GameBoard from '../GameBoard';

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

const SnakeGame = ({ isRunning, blocksCount, vGap, hGap, endGame, children }) => {
    const playerColor = '#473dbd';
    const foodColor = 'red';
    const [delay, setDelay] = useState(200);
    const [playerPosition, setPosition] = useState({x: 0, y: 0, direction: 'right', stepCount: 0, foodBlocksEaten: []});
    const randPosX = vGap * randomIntFromInterval(1, blocksCount - 1);
    const randPosY = hGap * randomIntFromInterval(1, blocksCount - 1);
    const [snakeFood, setSnakeFood] = useState({x: randPosX, y: randPosY});

    const isSnakeEating = snakeFood && (snakeFood.x === playerPosition.x &&
        snakeFood.y === playerPosition.y);

    // compare in different way look at x and y same time for each position!
    const createFoodOutsideSnake = useCallback((pPos, vg, hg) => {
        let x = vg * randomIntFromInterval(1, blocksCount - 1);
        let y = hg * randomIntFromInterval(1, blocksCount - 1);

        const allBlocks = [{ x: pPos.x, y: pPos.y }, ...pPos.foodBlocksEaten];
        const isInBody = allBlocks.some(block => {
            return block.x === x && block.y === y;
        });

        while (isInBody) {
            const newX = vg * randomIntFromInterval(1, blocksCount - 1);
            const newY = hg * randomIntFromInterval(1, blocksCount - 1);

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
    }, [blocksCount]);

    // Todo: fix this
    useEffect(() => {
        if (isSnakeEating) {
            console.log('eating')
            setPosition((prevState) => {
                return {
                    ...prevState,
                    foodBlocksEaten: [...prevState.foodBlocksEaten, {
                        x: playerPosition.x,
                        y: playerPosition.y
                    }]
                };
            });

            const { x, y } = createFoodOutsideSnake(playerPosition, vGap, hGap);

            setSnakeFood({ x, y });
        }
        
    }, [isSnakeEating, playerPosition, createFoodOutsideSnake, vGap, hGap]);

    useInterval(() => {
         const { x, y } =  createFoodOutsideSnake(playerPosition, vGap, hGap);

        setSnakeFood({ x, y });
    }, isRunning ? 3500 : null);

    // main game loop
    useInterval(() => {
        const stepCount = playerPosition.foodBlocksEaten.length >= playerPosition.stepCount ?
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
                stepCount: stepCount,
                foodBlocksEaten: [{ x: playerPosition.x, y: playerPosition.y }, ...playerPosition.foodBlocksEaten.slice(0, -1)]
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
                stepCount: stepCount,
                foodBlocksEaten: [{ x: playerPosition.x, y: playerPosition.y }, ...playerPosition.foodBlocksEaten.slice(0, -1)]
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
                stepCount: stepCount,
                foodBlocksEaten: [{ x: playerPosition.x, y: playerPosition.y }, ...playerPosition.foodBlocksEaten.slice(0, -1)]
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
                stepCount: stepCount,
                foodBlocksEaten: [{ x: playerPosition.x, y: playerPosition.y }, ...playerPosition.foodBlocksEaten.slice(0, -1)]
            });
        }
    }, isRunning ? delay : null);

    const move = () => (e) => {        
        if (!isRunning) {
            console.log('game ended!')
            return;
        }

        console.log(e.key)

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

    return (
            <svg tabIndex={0} onKeyDown={move()}>
                {children}
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
                    {playerPosition.foodBlocksEaten.map((block, i) => {
                        return <rect
                            fill={playerColor}
                            opacity={0.6}
                            x={block.x}
                            y={block.y} 
                            width={vGap}
                            height={hGap}
                            rx="2"
                            key={`food-eaten-${i}`}
                            >
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
            </svg>
    );   
}

export default SnakeGame;