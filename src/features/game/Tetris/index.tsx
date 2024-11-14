/**
 * First, we need to create a grid
 * Then we need to create a block
 * Then we need to create a block that moves
 * Then we need to create a block that moves and rotates
 * Then we need to create a block that moves, rotates and locks
 * Then we need to create a block that moves, rotates, locks and clears lines
 * Then we need to create a block that moves, rotates, locks, clears lines and levels up
 * Then we need to create a block that moves, rotates, locks, clears lines, levels up and game over
 * 
 * This is working under svg and can be saved/load from a json file or a database
 */

import { useImperativeHandle, forwardRef, useState } from "react";
import { GameProps } from "../GameBoard/GameBoard.types";
import Block from "./Block";
import TetrisBlocks from "./Blocks.data";

function drawTetrisBlock(name: string, size: number, color: string, blockXPos: number, blockYPos: number) {
	const block = TetrisBlocks.find(block => block.name ===  name);

	return block?.shape.map((row, y) => {
		return row.map((col, x) => {
			if (col === 1) {
				return <Block key={`${x}-${y}`} color={color} x={blockXPos - (x * size)} y={blockYPos - size - (y * size)} size={size} />	
			}

			return null;
		});
	});
}

const Tetris = forwardRef(({ children, isRunning, blocksCount, vGap, hGap, setScore, score, blockSize = 20 }: GameProps, ref) => {
	const [activeBlock, setActiveBlock] = useState({
		'name': 'I',
		'x': 0,
		'y': 0,
	}); // one of the TetrisBlocks 

	const moveBlock = (direction: string) => {
		setActiveBlock((prevBlock) => {
			switch (direction) {
				case 'left':
					return { ...prevBlock, x: prevBlock.x - blockSize };
				case 'right':
					return { ...prevBlock, x: prevBlock.x + blockSize };
				case 'down':
					return { ...prevBlock, y: prevBlock.y + blockSize };
				default:
					return prevBlock;
			}
		});
	}


	useImperativeHandle(ref, () => {
        return {
            resetGame: () => { console.log('reset game') },
            loadGame: () => { console.log('load game') },
            getGameState: { score, isRunning, foo: 'bar' },
            onKeyPress: (e: React.KeyboardEvent) => {
				console.log(e.key);
				if (e.key === 'ArrowLeft' || e.key === 'a') {
					moveBlock('left');
				}

				if (e.key === 'ArrowRight' || e.key === 'd') {
					moveBlock('right');
				}

				if (e.key === 'ArrowDown' || e.key === 's') {
					moveBlock('down');
				}

				if (e.key === ' ') {
					console.log('rotate');
				}
			}
        };
      }, [score, isRunning]);

	return (
		<>
			{children}
			<g>
				{/* player controlled block */}
				{drawTetrisBlock(activeBlock.name, 20, "red", activeBlock.x, activeBlock.y)}
				
				{/* blocks that are locked in */}
				{drawTetrisBlock("J", 20, "lightgreen", 20, 60)}
			</g>
		</>
	);
});

export default Tetris;