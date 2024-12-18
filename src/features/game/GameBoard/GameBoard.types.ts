export interface GameBoard {
    blocksCountH: number;
    blocksCountV: number;
    blocksH: number[];
    blocksV: number[];
    size: number;
	info?: string;
}

export interface GameBoards {
    [gameNameKey: string]: GameBoard
}

export interface GameState {
	activeGame: string;
	isRunning: boolean;
	gameBoards: GameBoards;
    score: number;
    statusMessage: string;
    iteration: number;
}

export type GameRef = { 
    // domRef?: {
    //     current: { focus: () => void } 
    // },
    resetGame: () => void ,
    getGameState: () => { playerPosition: number[], snakeFood: number[], delay: number },
    loadGame: () => void,
    onKeyPress: (e: React.KeyboardEvent<SVGSVGElement>) => void
}

export interface GameProps {
    isRunning: boolean;
    blocksCount: number;
    blockSize?: number;
    vGap: number; // remove these from everywhere except grid
    hGap: number;
    setScore: (score: number) => void;
    children?: React.ReactNode;
    score: number;
    ref?: React.RefObject<GameRef>;
}