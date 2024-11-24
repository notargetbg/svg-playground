import { GameState } from "../GameBoard/GameBoard.types";

export const actions = {
	setGame: 'SET_GAME',
	togglePauseGame: 'TOGGLE_PAUSE_GAME',
	loadGame: 'LOAD_GAME',
	endGame: 'END_GAME',
	restartGame: 'RESTART_GAME',
	updateGameField: 'UPDATE_GAME_FIELD',
}

// export action creators
export function setGame(game: string) {
	return { type: actions.setGame, payload: game }
}

export function togglePauseGame() {
	return { type: actions.togglePauseGame }
}

export function loadGame(gameName: string) {
	return { type: actions.loadGame, payload: { gameName } }
}

export function endGame() {
	return { type: actions.endGame }
}

export function restartGame() {
	return { type: actions.restartGame }
}

export function updateGameField(field: string, value: any) {
	return { type: actions.updateGameField, payload: { field, value } }
}

export function gamesReducer(gameState: GameState, action: any ) {
	switch (action.type) {

		// when choosing a game, we set active game string key
		case actions.setGame:
			return { ...gameState, activeGame: action.payload }
		case actions.togglePauseGame:
			return { ...gameState, isRunning: !gameState.isRunning, statusMessage: !gameState.isRunning ? 'Game running' : 'PAUSED' } 
		case actions.loadGame:
			return { ...gameState, isRunning: false, activeGame: action.payload.gameName }
		case actions.endGame:
			return { ...gameState, isRunning: false, statusMessage: 'Game Over!' }
		case actions.restartGame:			
			return { ...gameState, isRunning: true, statusMessage: 'Restarting' }
		case actions.updateGameField: {
			return { ...gameState, [action.payload.field]: action.payload.value }
		}

		default:
			return gameState;
	}
}