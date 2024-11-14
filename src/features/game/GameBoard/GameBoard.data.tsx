import { createContext, Dispatch, useReducer, ReactNode, useContext } from 'react';
import { GameBoards, GameState } from './GameBoard.types';

// All game boards as a board configuration
const gameBoards: GameBoards = {
    snake: {
		info: "Snake game. You know the rules",
		...getBoardByCountVH(20, 20, 20)
	},
    tetris: getBoardByCountVH(20, 10, 20),
}

// Initial game state
const initialState: GameState = {
	activeGame: 'snake',
	isRunning: false,
	gameBoards,
	statusMessage: 'Go when ready!',
	score: 0
}

export const GamesContext = createContext<GameState>(initialState);
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

export function useGamesDispatch(): Dispatch<{ type: string, payload?: any }> {
	if (!useContext(GamesDispatchContext)) {
		throw new Error('dispatch must be used within a GamesDispatchContext Provider');
	}

	return useContext(GamesDispatchContext);
}

// export action creators

export function setGame(game: string) {
	return { type: 'SET_GAME', payload: game }
}

export function updateGameField(field: string, value: any) {
	return { type: 'UPDATE_GAME_FIELD', payload: { field, value } }
}

function gamesReducer(gameState: GameState, action: any ) {

	// console.log('GAMES REDUCER ACTION', action);
	// console.log('GAMES REDUCER STATE', gameState);

	switch (action.type) {

		// when choosing a game, we set active game string key
		case 'SET_GAME':
			return { ...gameState, activeGame: action.payload }
		case 'TOGGLE_PAUSE_GAME':
			return { ...gameState, isRunning: !gameState.isRunning, statusMessage: !gameState.isRunning ? 'Game running' : 'PAUSED' } 
		case 'LOAD_GAME':
			return { ...gameState, isRunning: false, activeGame: action.payload.gameName }
		case 'END_GAME':
			return { ...gameState, isRunning: false }
		case 'RESTART_GAME':
			return { ...gameState, isRunning: true }
		case 'UPDATE_GAME_FIELD': {
			console.log('UPDATE_GAME_FIELD', action);
			return { ...gameState, [action.payload.field]: action.payload.value }
		}

		default:
			return gameState;
	}
}