import { useCallback, useEffect, useState } from "react";
import { updateGameField, useGamesDispatch, useGamesState } from "../GameBoard.data";
import { GameRef } from "../GameBoard.types";
 /*** 
	* Game menu
	* Main menu: Options, Start game, Leaderboard, Quit
	* Options: Difficulty, Sound, Controls
	* Leaderboard: Top 10 players
	* Quit: Exit game after confirmation
	* Start game: Starts the game
	* 
	* Each menu item should have a keyboard shortcut
	* With pressing of escape key, menu first closes the current menu, if no inner menu is open, then close menu
	* 
	* @param menuDefinition
	*/

let restartTimeout: NodeJS.Timeout | null = null;

interface MenuProps {
	gameRef: React.RefObject<GameRef>;
	domRef: React.RefObject<SVGSVGElement>;
}

type MenuDefinition = 'mainMenu' | 'options' | 'leaderboard' | 'closed';

function Menu({ gameRef, domRef }: MenuProps) {
	const [activeMenu, setActiveMenu] = useState<MenuDefinition>('closed');
	const { gameBoards, activeGame, isRunning, score, statusMessage } = useGamesState();
	const dispatch = useGamesDispatch();

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

            if (domRef.current) {
                domRef.current.focus()
            }
        } catch (error) {
            console.log(error);
        }
    }, [dispatch, domRef, gameRef]);
    
    const handleSaveGame = useCallback(() => {
        if (!gameRef.current) return;

		dispatch(updateGameField('statusMessage', `Saving ${activeGame.toUpperCase()} ...`));

		setTimeout(() => {
			dispatch(updateGameField('statusMessage', `Saved ${activeGame.toUpperCase()}, now GO!`));
		}, 2000);

        const { playerPosition, snakeFood, delay } = gameRef.current.getGameState();

        dispatch({ type: 'SAVE_GAME', payload: { gameName: activeGame, score } });

        localStorage.setItem(activeGame, JSON.stringify({
            playerPosition,
            snakeFood,
            delay,
            score,
        }));

		localStorage.setItem('game-last-played', activeGame);

    }, [score, activeGame, dispatch, gameRef]);

    const handleLoadGame = useCallback(() => {
        if (!gameRef.current) return;
        dispatch({ type: 'LOAD_GAME', payload: { gameName: activeGame } });
        dispatch(updateGameField('statusMessage', 'LOADING GAME ...'));
        gameRef.current.loadGame();
    }, [activeGame, dispatch, gameRef]);

    const handleTogglePauseGame = useCallback(() => {
        dispatch({ type: 'TOGGLE_PAUSE_GAME' });
    }, [dispatch]);

    const handleEndGame = () => {
        dispatch({ type: 'END_GAME' });
    };

	const menuDefinition = {
		mainMenu: {
			label: 'Main menu',
			items: [
				{
					label: isRunning ? 'Pause' : 'Resume',
					action: handleTogglePauseGame
				},
				{
					label: 'Save game',
					action: handleSaveGame
				},
				{
					label: 'Load game',
					action: handleLoadGame
				},			
				{
					label: 'Options',
					action: () => {
						setActiveMenu('options');
					}
				},
				{
					label: 'Leaderboard',
					action: () => {
						setActiveMenu('leaderboard');
					}
				},
				{
					label: 'Restart',
					action: handleRestartGame
				},
				{
					label: 'Quit',
					action: handleEndGame
				}
			]
		},
		options: {
			label: 'Options',
			items: [
				{
					label: 'Difficulty',
					action: () => {
						// show difficulty options
					}
				},
				{
					label: 'Sound',
					action: () => {
						// show sound options
					}
				},
				{
					label: 'Controls',
					action: () => {
						// show controls options
					}
				},
				{
					label: 'Back',
					action: () => {
						setActiveMenu('mainMenu');
					}
				}
			]
		},
		leaderboard: {
			label: 'Leaderboard',
			items: [
				{
					label: 'Top 10 players',
					action: () => {
						// show top 10 players
					}
				},
				{
					label: 'Back',
					action: () => {
						setActiveMenu('mainMenu');
					}
				}
			]
		}
	}

	const handleKeyPress = useCallback((e: KeyboardEvent) => {
		if (e.key === 'F5') {
			e.preventDefault();
			// save game
			handleSaveGame();
		}

		if (e.key === 'F9') {
			e.preventDefault();
			// load game
			handleLoadGame();
		}

		if (e.key === 'F10') {
			e.preventDefault();
			// restart game
			handleRestartGame();
		}

		if (e.key === 'F1') {
			e.preventDefault();
			// pause/unpause game
			handleTogglePauseGame();
		}

		if (e.key === 'Escape') {
			if (activeMenu !== 'mainMenu') {
				setActiveMenu('mainMenu');
			} else {
				setActiveMenu('closed');
			}
		}

	}, [activeMenu, handleSaveGame, handleLoadGame, handleRestartGame, handleTogglePauseGame]);

	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress);

		// cleanup
		return () => {
			window.removeEventListener('keydown', handleKeyPress);
			restartTimeout && clearTimeout(restartTimeout);
		}
	}, [handleKeyPress]);

	const chooseGame = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
		localStorage.setItem('game-last-played', e.target.value);
		dispatch({ type: 'SET_GAME', payload: e.target.value });
	}, [dispatch]);

	return (
		<nav className="menu">
			{statusMessage && <h3>{statusMessage}</h3>}
			<select onChange={chooseGame} defaultValue={activeGame}>
				{Object.keys(gameBoards).map((game) => <option key={game} value={game} >{game}</option>)}
			</select>
			<div className='game-actions'>
				<strong>High score:{score}</strong>

				{activeMenu !== 'closed' && (
				<div>
					<hr />
					<span style={{fontFamily: 'monospace', 'textTransform': 'lowercase'}}>
						{menuDefinition[activeMenu].label}
					</span>
					
					<div className="menu-items">
						{menuDefinition[activeMenu].items.map((item, i) => (
							<button key={i} onClick={item.action}>{item.label}</button>
						))}
					</div>
				</div>
				)}
			</div>
		</nav>
	);
}

export default Menu;