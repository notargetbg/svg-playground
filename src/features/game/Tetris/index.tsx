// Figure out how to implement Tetris in React
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



function Tetris({ children, blocksH, blocksV, vGap, hGap }) {




	return (
		<div>
			{children}
		</div>
	);
}

export default Tetris;