export interface GameBoard {
    blocksCountH: number;
    blocksCountV: number;
    blocksH: number[];
    blocksV: number[];
	info?: string;
}

export interface GameBoards {
    [gameNameKey: string]: GameBoard
}

export interface GameState {
	activeGame: string;
	isRunning: boolean;
	gameBoards: GameBoards;
}
