import { useGamesState } from "../GameBoard/GameBoard.data";

function EndGameScreen () {
	const { score } = useGamesState();


	const handleResetGame = () => {
		// trigger reset game
		
	}

	// display a modal popup with the game results
	// display a form to enter the player's name and submit the score
	// display a button to restart the game
	return (

		<div className="end-game-screen">
			<h1>Game Over</h1>
			<p>Your score is: {score}</p>
			{/* use react hook form here */}
			<form>
				<label>Enter your name</label>
				<input type="text" name="playerName" id="playerName" />
				<button>Submit</button>
			</form>
			<button onClick={handleResetGame}>Start over?</button>
		</div>
	)
}

export default EndGameScreen;