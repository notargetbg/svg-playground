import React, { useImperativeHandle, useMemo } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { randomIntFromInterval } from '../../../app/utils';
import { updateGameField, useGamesDispatch } from '../GameBoard/GameBoard.data';
import SnakeFood from './SnakeFood';
import { GameProps } from '../GameBoard/GameBoard.types';
import { useGameLoop } from '../hooks/useGameLoop';
import { usePromptContext } from '../hooks/usePromptContext';

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

const getRandPosition = (blocksCount: number, vGap: number, hGap: number): Position => ({
    x: randomIntFromInterval(1, blocksCount - 1) * vGap,
    y: randomIntFromInterval(1, blocksCount - 1) * hGap
});

const getInitialPlayerPosition = (blocksCount: number, vGap: number, hGap: number): playerPosition => {
    const position = getRandPosition(blocksCount, vGap, hGap);
    return {
        x: position.x,
        y: position.y,
        direction: 'right', // randomize direction using lodash
        stepCount: 0, 
        foodBlocksEaten: [], 
        turns: []
    }
};

const initialDelay: number = 500;

const SnakeGame = React.forwardRef(({ isRunning, blocksCount, vGap, hGap, setScore, children, score }: GameProps, ref) => {
    const initialPlayerPosition = getInitialPlayerPosition(blocksCount, vGap, hGap);
    const baseScore = 50;
    const difficulty = 1;
    const playerColor = '#473dbd';
    const [delay, setDelay] = useState(initialDelay);
    const [playerPosition, setPosition] = useState<{
        x: number;
        y: number;
        direction: string;
        stepCount: number;
        foodBlocksEaten: Position[];
        turns: Turn[];
    }>(initialPlayerPosition);
    const randPosX = vGap * randomIntFromInterval(1, blocksCount - 1);
    const randPosY = hGap * randomIntFromInterval(1, blocksCount - 1);
    const [snakeFood, setSnakeFood] = useState({x: randPosX, y: randPosY});

    const dispatch = useGamesDispatch();

    // useEffectCustom();
    
    const resetGame = useCallback(() => {
        setPosition(initialPlayerPosition);
        const randomPosition = getRandPosition(blocksCount, vGap, hGap);
        setSnakeFood({
            x:  randomPosition.x,
            y: randomPosition.y
        });
        setDelay(initialDelay)
    }, [initialPlayerPosition, vGap, hGap, blocksCount]);

    const getGameState = useCallback(() => {
        return {
            playerPosition,
            snakeFood,
            delay
        }
    }, [playerPosition, snakeFood, delay]);

    const loadGame = useCallback(() => {
        console.log('loading game ...');
        // simulate loading time with timeout for now
        // todo - add loading spinner
        setTimeout(() => {
            console.log('game loaded!');
            dispatch(updateGameField('statusMessage', 'Game Loaded!'));

            const lastPlayedGame = localStorage.getItem('game-last-played');
            const savedGame = localStorage.getItem(lastPlayedGame || 'snake');
            
            if (!savedGame) {
                console.log('no saved game')
                return;
            }

            const { playerPosition, snakeFood, delay, score} = JSON.parse(savedGame);

            setPosition(playerPosition);
            setSnakeFood(snakeFood);
            setDelay(delay);
            setScore(score);
        }, 2000);

    }, [dispatch, setScore, setDelay, setPosition, setSnakeFood]);

    const turnCallback = useCallback((e: React.KeyboardEvent<SVGSVGElement>) => {
        if (!isRunning) {
            console.log('game paused!')
            return;
        }

        console.log('doTurn CALLED', e)

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

    }, [blocksCount, playerPosition, vGap, hGap, isRunning]);

    useImperativeHandle(ref, () => {
        return {
            resetGame,
            loadGame,
            getGameState,
            onKeyPress: turnCallback
        };
      }, [resetGame, getGameState, loadGame, turnCallback]);

    const isSnakeEating = useMemo(() => snakeFood && 
        (snakeFood.x === playerPosition.x &&
        snakeFood.y === playerPosition.y), 
        [snakeFood, playerPosition]
    );

    // compare in different way look at x and y same time for each position!
    const createFoodOutsideSnake = useCallback((pPos: playerPosition, vg: number, hg: number) => {
        let foodPosX = vg * randomIntFromInterval(1, blocksCount - 1);
        let foodPosY = hg * randomIntFromInterval(1, blocksCount - 1);

        const allBlocks = [{ x: pPos.x, y: pPos.y }, ...pPos.foodBlocksEaten];
        const isInBody = allBlocks.some(block => {
            return block.x === foodPosX && block.y === foodPosY;
        });

        while (isInBody) {
            const newX = vg * randomIntFromInterval(1, blocksCount - 1);
            const newY = hg * randomIntFromInterval(1, blocksCount - 1);

            const isInBody = allBlocks.some(block => {
                return block.x === newX && block.y === newY;
            });

            if (!isInBody) {
                // found a position outside the snake
                foodPosX = newX;
                foodPosY = newY;
                
                break;
            }

            foodPosX = newX;
            foodPosY = newY;
        }

        return { x: foodPosX, y: foodPosY }
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
        
    }, [isSnakeEating, playerPosition, createFoodOutsideSnake, vGap, hGap, setScore, setDelay, delay, score]);

    const { dispatch: dispatchPrompt } = usePromptContext();
    const endGame = useCallback(() => {
        dispatch({ type: 'END_GAME' });
        dispatchPrompt({ type: 'SHOW' });

        // open modal with simple nice looking game over screen
        // save score to leaderboard with name input
        // call reset game after 5 seconds
    }, [dispatch, dispatchPrompt]);

    // useInterval(() => {
    //     const { x, y } =  createFoodOutsideSnake(playerPosition, vGap, hGap);
        
    //     setSnakeFood({ x, y });
    // }, isRunning ? 13500 : null);    

    // main game loop
    const loopStep = () => {
        const stepCount = playerPosition.foodBlocksEaten.length >= playerPosition.stepCount ?
            playerPosition.stepCount + 1 :
            playerPosition.stepCount;

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

    };

    useGameLoop(loopStep, delay); 

    return (
    <>
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
                    rx="6"
                    className={turnStyle}
                    key={`food-eaten-${i}`}
                    >
                    food
                </rect>
            })}
        </g>
        
        <SnakeFood width={vGap} height={hGap} snakeFood={snakeFood} />
    </>);   
})

export default SnakeGame;