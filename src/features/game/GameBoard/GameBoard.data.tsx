import { createContext, Dispatch, useReducer, ReactNode, useContext } from 'react';
import { GameBoards, GameState } from './GameBoard.types';
import { gameSlice } from '../features';

// All game boards as a board configuration
const gameBoards: GameBoards = {
    snake: {
		info: "Snake game. You know the rules",
		...getBoardByCountVH(20, 20, 20)
	},
    tetris: getBoardByCountVH(20, 10, 20),
}

const initialState: GameState = {
	activeGame: 'snake',
	isRunning: false,
	gameBoards,
	statusMessage: 'Go when ready!',
	score: 0,
	iteration: 0,
};

// Try to populate initial game state from ls
const getIntialState = (): GameState => {
	try {
		return {
			...initialState,
			activeGame: localStorage.getItem('game-last-played') || 'snake',
		}
	} catch (error) {
		console.error('Error getting activeGame from LS', error);
		return initialState
	}
}

export const GamesContext = createContext<GameState>(getIntialState());
export const GamesDispatchContext = createContext<Dispatch<any>>(() => {});

function getBoardByCountVH(blocksCountV: number, blocksCountH: number, size: number) {
    return {
        blocksCountH,
        blocksCountV,
        blocksH: Array.from({ length: blocksCountH }, (_, i) => i + 1),
        blocksV: Array.from({ length: blocksCountV }, (_, i) => i + 1),
		size
    }
}

interface GamesProviderProps {
	children: ReactNode
}

export function GamesProvider({ children }: GamesProviderProps) {
	const [gameBoard, dispatch] = useReducer(gameSlice.gamesReducer, getIntialState());

	return (
		<GamesContext.Provider value={gameBoard}>
			<GamesDispatchContext.Provider value={dispatch}>
				{children}
			</GamesDispatchContext.Provider>
		</GamesContext.Provider>
	)
}

export function useGamesState(): GameState {

	if (!useContext(GamesContext)) {
		throw new Error('useGamesState must be used within a GamesProvider');
	}

	return useContext(GamesContext);
}

export function useGamesDispatch(): Dispatch<{ type: string, payload?: any }> {
	if (!useContext(GamesDispatchContext)) {
		throw new Error('dispatch must be used within a GamesDispatchContext Provider');
	}

	return useContext(GamesDispatchContext);
}
