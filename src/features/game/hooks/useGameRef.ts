import { useRef } from "react";
import { GameRef } from "../GameBoard/GameBoard.types";

let gameRef: GameRef;
export function useGameRef() {

	function setGameRef(ref: GameRef) {
		gameRef = ref;
	}
	
	return {
		gameRef: {
			current: gameRef
		},
		setGameRef,
		resetGame: () => {},
		getGameState: () => { return { playerPosition: [], snakeFood: [], delay: 0 } },
		loadGame: () => {},
		onKeyPress: (e: React.KeyboardEvent<SVGSVGElement>) => {}
	}
}