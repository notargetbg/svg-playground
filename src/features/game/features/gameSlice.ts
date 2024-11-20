import { GameState } from "../GameBoard/GameBoard.types"

// export action creators
export function setGame(game: string) {
	return { type: 'SET_GAME', payload: game }
}

export function togglePauseGame() {
	return { type: 'TOGGLE_PAUSE_GAME' }
}

export function loadGame(gameName: string) {
	return { type: 'LOAD_GAME', payload: { gameName } }
}

export function endGame() {
	return { type: 'END_GAME' }
}

export function restartGame() {
	return { type: 'RESTART_GAME' }
}

export function updateGameField(field: string, value: any) {
	return { type: 'UPDATE_GAME_FIELD', payload: { field, value } }
}

export function gamesReducer(gameState: GameState, action: any ) {
	switch (action.type) {

		// when choosing a game, we set active game string key
		case 'SET_GAME':
			return { ...gameState, activeGame: action.payload }
		case 'TOGGLE_PAUSE_GAME':
			return { ...gameState, isRunning: !gameState.isRunning, statusMessage: !gameState.isRunning ? 'Game running' : 'PAUSED' } 
		case 'LOAD_GAME':
			return { ...gameState, isRunning: false, activeGame: action.payload.gameName }
		case 'END_GAME':
			return { ...gameState, isRunning: false, gameState: 'Game Over!' }
		case 'RESTART_GAME':			
			return { ...gameState, isRunning: true, gameState: 'Restarting' }
		case 'UPDATE_GAME_FIELD': {
			return { ...gameState, [action.payload.field]: action.payload.value }
		}

		default:
			return gameState;
	}
}