import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { randomIntFromInterval, useInterval } from '../../../app/utils';

/* 
    Game is working! Wohoo
    Todos:
    - add leveling system
    - add game over conditions ( when snek eats itself )
    - add rules not to spawn food on snek body - done
    - add leaderboard
    - build and deploy
    - add configuration
*/

// reset();

interface Position {
    x: number;
    y: number;
}

interface Turn extends Position {
    direction: string;
}

type playerPosition = {
    x: number;
    y: number;
    direction: string;
    stepCount: number;
    foodBlocksEaten: Position[];
    turns: Turn[];
}

const initialPosition: playerPosition = {x: 0, y: 0, direction: 'right', stepCount: 0, foodBlocksEaten: [], turns: []};
const initialDelay: number = 500;
interface SnakeGameProps {
    isRunning: boolean;
    blocksCount: number;
    vGap: number;
    hGap: number;
    endGame: () => void;
    setScore: (score: number) => void;
    children: React.ReactNode;
    score: number;
}


const SnakeGame = React.forwardRef(({ isRunning, blocksCount, vGap, hGap, endGame, setScore, children, score }: SnakeGameProps, ref) => {
    const baseScore = 50;
    const difficulty = 1;
    const playerColor = '#473dbd';
    const foodColor = 'red';
    const [delay, setDelay] = useState(initialDelay);
    const [playerPosition, setPosition] = useState<{
        x: number;
        y: number;
        direction: string;
        stepCount: number;
        foodBlocksEaten: Position[];
        turns: Turn[];
    }>(initialPosition);
    const randPosX = vGap * randomIntFromInterval(1, blocksCount - 1);
    const randPosY = hGap * randomIntFromInterval(1, blocksCount - 1);
    const [snakeFood, setSnakeFood] = useState({x: randPosX, y: randPosY});

    const domRef = useRef(null);

    const resetGame = useCallback(() => {
        setPosition(initialPosition);
        setSnakeFood({
            x:  vGap * randomIntFromInterval(1, blocksCount - 1),
            y: hGap * randomIntFromInterval(1, blocksCount - 1)}
            )
        setDelay(initialDelay)
    }, [vGap, hGap, blocksCount])

    const isSnakeEating = snakeFood && (snakeFood.x === playerPosition.x &&
        snakeFood.y === playerPosition.y);

    // compare in different way look at x and y same time for each position!
    const createFoodOutsideSnake = useCallback((pPos: playerPosition, vg: number, hg: number) => {
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

            const scoreIncrement = difficulty * baseScore
            setScore(scoreIncrement);

            // every 500 points we speed up the game
            if ((score + scoreIncrement) % 100 === 0) {
                console.log('speed up')
                setDelay(delay - (delay * 0.05))
            }

            const { x, y } = createFoodOutsideSnake(playerPosition, vGap, hGap);

            setSnakeFood({ x, y });
        }
        
    }, [isSnakeEating, playerPosition, createFoodOutsideSnake, vGap, hGap]);

    // useInterval(() => {
    //     const { x, y } =  createFoodOutsideSnake(playerPosition, vGap, hGap);
        
    //     setSnakeFood({ x, y });
    // }, isRunning ? 13500 : null);

    // main game loop
    useInterval(() => {
        const stepCount = playerPosition.foodBlocksEaten.length >= playerPosition.stepCount ?
            playerPosition.stepCount + 1 :
            playerPosition.stepCount;

        if (!isRunning) {
            return;
        }

        let newPosition = {
            ...playerPosition,
            stepCount: stepCount,
            foodBlocksEaten: [{ x: playerPosition.x, y: playerPosition.y }, ...playerPosition.foodBlocksEaten.slice(0, -1)]
        }

        if (playerPosition.direction === 'left') {
            if (playerPosition.x === 0) {
                endGame();
                return;
            };

            // setPosition({
            //     ...playerPosition,
            //     x: playerPosition.x - hGap,
            //     stepCount: stepCount,
            //     foodBlocksEaten: [{ x: playerPosition.x, y: playerPosition.y }, ...playerPosition.foodBlocksEaten.slice(0, -1)]
            // });

            newPosition = {
                ...newPosition,
                x: playerPosition.x - hGap,
            }
        }

        if (playerPosition.direction === 'right') {
            if (playerPosition.x >= (blocksCount * hGap) - hGap) {
                endGame();
                return;
            };

            // setPosition({
            //     ...playerPosition,
            //     x: playerPosition.x + hGap,
            //     stepCount: stepCount,
            //     foodBlocksEaten: [{ x: playerPosition.x, y: playerPosition.y }, ...playerPosition.foodBlocksEaten.slice(0, -1)]
            // });

            newPosition = {
                ...newPosition,
                x: playerPosition.x + hGap,
            }
        }

        if (playerPosition.direction === 'top') {
            if (playerPosition.y === 0) {
                endGame();
                return;
            };

            // setPosition({
            //     ...playerPosition,
            //     y: playerPosition.y - vGap,
            //     stepCount: stepCount,
            //     foodBlocksEaten: [{ x: playerPosition.x, y: playerPosition.y }, ...playerPosition.foodBlocksEaten.slice(0, -1)]
            // });

            newPosition = {
                ...newPosition,
                y: playerPosition.y - vGap,
            }
        }

        if (playerPosition.direction === 'bottom') {
            if (playerPosition.y >= (blocksCount * vGap) - vGap) {
                endGame();
                return;
            };

            // setPosition({
            //     ...playerPosition,
            //     y: playerPosition.y + vGap,
            //     stepCount: stepCount,
            //     foodBlocksEaten: [{ x: playerPosition.x, y: playerPosition.y }, ...playerPosition.foodBlocksEaten.slice(0, -1)]
            // });

            newPosition = {
                ...newPosition,
                y: playerPosition.y + vGap,
            }
        }

        if (newPosition.foodBlocksEaten.some(block => block.x === newPosition.x && block.y === newPosition.y)) {
            console.log('ending game!')
            console.log(playerPosition.foodBlocksEaten);
            endGame();
            return;
        }

        setPosition({
            ...newPosition, 
            turns: newPosition.turns.filter(turn => {
                return newPosition.foodBlocksEaten.some(foodBlock => foodBlock.x === turn.x && foodBlock.y === turn.y)
            }),
        });

    }, delay);

    const doTurn = () => (e: React.KeyboardEvent<SVGSVGElement>) => {
        if (!isRunning) {
            console.log('game ended!')
            return;
        }

        console.log(e)

        if (e.key.toLowerCase() === 'a' || e.keyCode === 37) {
            const outOfBounds = playerPosition.x === 0;
            // const goingBackwards = direction rigth minus 1 block

            
            if (outOfBounds || playerPosition.direction === 'right') return;

            setPosition({
                ...playerPosition,
                // x: playerPosition.x - hGap,
                direction: 'left',
                stepCount: 0,
                turns: [...playerPosition.turns, {
                    x: playerPosition.x,
                    y: playerPosition.y,
                    direction: `${playerPosition.direction}-left`
                }]
            });
        }

        if (e.key.toLowerCase() === 'd' || e.keyCode === 39) {
            const outOfBounds = (playerPosition.x >= (blocksCount * hGap) - hGap);
            if (outOfBounds || playerPosition.direction === 'left') return;

            setPosition({
                ...playerPosition,
                // x: playerPosition.x + hGap,
                direction: 'right',
                stepCount: 0,
                turns: [...playerPosition.turns, {
                    x: playerPosition.x,
                    y: playerPosition.y,
                    direction: `${playerPosition.direction}-right`
                }]
            });
        }

        if (e.key.toLowerCase() === 'w' || e.keyCode === 38) {
            const outOfBounds = playerPosition.y === 0;
            if (outOfBounds || playerPosition.direction === 'bottom') return;

            setPosition({
                ...playerPosition,
                // y: playerPosition.y - vGap,
                direction: 'top',
                stepCount: 0,
                turns: [...playerPosition.turns, {
                    x: playerPosition.x,
                    y: playerPosition.y,
                    direction: `${playerPosition.direction}-top`
                }]
            });
        }

        if (e.key.toLowerCase() === 's' || e.keyCode === 40) {
            const outOfBounds = (playerPosition.y >= (blocksCount * vGap) - vGap);
            if (outOfBounds || playerPosition.direction === 'top') return;

            setPosition({
                ...playerPosition,
                // y: playerPosition.y + vGap,
                direction: 'bottom',
                stepCount: 0,
                turns: [...playerPosition.turns, {
                    x: playerPosition.x,
                    y: playerPosition.y,
                    direction: `${playerPosition.direction}-bottom`
                }]
            });
        }

    };    

    useImperativeHandle(ref, () => {
        return {
            domRef,
            resetGame,
        };
      }, [resetGame]);

    return (
            <svg tabIndex={0} onKeyDown={doTurn()} ref={domRef}>
                {children}
                <g className='mark-turn'>
                    {/* {playerPosition.turns.map(turn => {
                        return (
                            <rect
                                fill={playerColor}
                                x={turn.x}
                                y={turn.y} 
                                width={vGap}
                                height={hGap}
                                rx="2"
                            >
                                x
                            </rect>
                        );
                    })} */}
                </g>
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
                        const turnsMatch = playerPosition.turns.filter(turn => turn.x === block.x && turn.y === block.y);
                        const turnStyle = turnsMatch[0] ? `${turnsMatch[0].direction}-turn` : '';

                        return <rect
                            fill={playerColor}
                            opacity={0.6}
                            x={block.x}
                            y={block.y} 
                            width={vGap}
                            height={hGap}
                            rx="2"
                            className={turnStyle}
                            key={`food-eaten-${i}`}
                            >
                            food
                        </rect>
                    })}
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
})

export default SnakeGame;