import { KeyboardEvent, useRef } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import Snake from '../Snake/Snake';
import Tetris from '../Tetris';
import { updateGameField, useGamesDispatch, useGamesState } from './GameBoard.data';
import GridGameboard from '../GameBoard/GridGameboard';
import { GameRef } from './GameBoard.types';
import Menu from './Menu';
import { defaultKeyboardShortcuts } from './KeyboardBindings';

/* 
    Snek Game is working! Wohoo
    Todos:
    - add leveling system - done 
    - add game over conditions ( when snek eats itself ) - done
    - add rules not to spawn food on snek body - done
    - add leaderboard - done
    - build and deploy - done
    - add pause game - done
    - add save game - done
    - add load game - done
    - add restart game - done
    - add game over message - in progress
    - add configuration - not started
*/

const calculateGaps = (blocksCountV: number, blocksCountH: number, size: number) => {
    const width = blocksCountH * size;
    const height = blocksCountV * size;

    return {
        vGap: Math.ceil(width / blocksCountV),
        hGap : Math.ceil(height / blocksCountH),
    }
}

// on restart
// show on screen message
// get ready ...
// hunt!

const GameBoard = () => {
    const { gameBoards, activeGame, isRunning, score } = useGamesState();
    const domRef = useRef<SVGSVGElement>(null);
    const gameRef = useRef<GameRef>(null);
    const dispatch = useGamesDispatch();
    
    // todo: make dynamic and animate snake movement smoothly
    const { blocksCountH, blocksCountV, blocksH, blocksV, size } = gameBoards[activeGame.toLowerCase()];
    const { vGap , hGap } = calculateGaps(blocksCountV, blocksCountH, size);

    useEffect(() => {
        if (domRef.current) {
            domRef.current.focus()
        }
    }, []);

    const handleSetScore = (scoreIncrement: number) => {
        dispatch(updateGameField('score', score + scoreIncrement));
    }

    const handleKeyDown = useCallback((e: KeyboardEvent<SVGSVGElement>) => {
        gameRef.current?.onKeyPress(e);
    }, [gameRef])

    const width = blocksCountH * size;
    const height = blocksCountV * size

    console.log("RENDERING GAME BOARD");

    console.log(Object.entries(defaultKeyboardShortcuts))

    return (
        <>
            <h1 className='game-title'>{activeGame}</h1>      
            <Menu gameRef={gameRef} domRef={domRef} />
            {/* sidebar showing key bindings */}
            <aside className='sidebar'>
                <h2>Key Bindings</h2>
                <ul>                    
                    {
                        Object.entries(defaultKeyboardShortcuts).map((entry) => {
                            const [key, value] = entry;
                            return (
                                <li key={key}>
                                    <span>{key} - {value}</span>
                                </li>
                            )
                        })
                    }
                </ul>
            </aside>
            <div style={{ height, width }} className={`game-wrapper ${activeGame.toLowerCase()}`}
                tabIndex={0}
            >
                {/**
                 * Part 1. Add the ability to save and load the game
                 * Part 2. Add the ability to play the game on network
                 * Part 3. Add the ability to play the game with AI, train a model to play the game versus human
                 * Part 4. Add the ability to play the game with friends by loading another game on the same screen
                 */}

                <svg tabIndex={0} onKeyDown={handleKeyDown} ref={domRef}>
                    {activeGame === 'snake' && 
                        <Snake 
                            vGap={vGap} 
                            hGap={hGap} 
                            blocksCount={blocksCountV}
                            isRunning={isRunning} 
                            score={score} 
                            setScore={handleSetScore} 
                            ref={gameRef}
                        />
                    }

                    {activeGame === 'tetris' &&
                        <Tetris
                            vGap={vGap} 
                            hGap={hGap} 
                            blocksCount={blocksCountV}
                            isRunning={isRunning} 
                            score={score} 
                            setScore={handleSetScore} 
                            ref={gameRef}
                        />
                    }
                    <GridGameboard blocksH={blocksH} blocksV={blocksV} vGap={vGap} hGap={hGap} size={size} />
                </svg>                
            </div>
        </>
    );   
}

export default GameBoard;