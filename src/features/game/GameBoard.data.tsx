import { createContext, Dispatch, useReducer, ReactNode, useContext } from 'react';
import { GameBoards, GameState } from './GameBoard.types';

export const GamesContext = createContext<GameState>({ activeGame: 'snake', isRunning: false, gameBoards: {} });
export const GamesDispatchContext = createContext<Dispatch<any> | null>(null);

function getBoardByCountVH(blocksCountV: number, blocksCountH: number) {
    return {
        blocksCountH,
        blocksCountV,
        blocksH: Array.from({ length: blocksCountH }, (_, i) => i),
        blocksV: Array.from({ length: blocksCountV }, (_, i) => i),
    }
}

const gameBoards: GameBoards = {
    snake: {
		info: "Snake game. You know the rules",
		...getBoardByCountVH(20, 20)
	},
    tetris: getBoardByCountVH(20, 10),
}

const initialState: GameState = {
	activeGame: 'snake',
	isRunning: false,
	gameBoards,
}

interface GamesProviderProps {
	children: ReactNode
}

export function GamesProvider({ children }: GamesProviderProps) {
	const [gameBoard, dispatch] = useReducer(gamesReducer, initialState);

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

export function useGamesDispatch() {
	return useContext(GamesDispatchContext);
}

function gamesReducer(gameState: GameState, action: any ) {
	switch (action.type) {
		case 'SET_GAME':
			return { ...gameState, activeGame: action.payload }
		case 'PAUSE_GAME':
			return { ...gameState, activeGame: null }

		default:
			return gameState;
	}
}


