 /** 
        * Game menu
        * Main menu: Options, Start game, Leaderboard, Quit
        * Options: Difficulty, Sound, Controls
        * Leaderboard: Top 10 players
        * Quit: Exit game after confirmation
        * Start game: Starts the game
        * 
        * Each menu item should have a keyboard shortcut
        * With pressing of escape key, menu first closes the current menu, if no inner menu is open, then close menu
        * 
        */
 const menuItems = [
	{
		label: 'Choose game', // if game is already chosen, set the game as active
		action: () => {
			// set game as active
					  
			handleRestart();
		}
	},
	{
		label: 'Leaderboard',
		action: () => {
			console.log('Leaderboard');
		}
	},
	{
		label: 'Options',
		action: () => {
			console.log('Options');
		}
	},
	{
		label: 'Quit',
		action: () => {
			console.log('Quit');
		}
	}
]

function Menu(menuDefinition: any) {


	return (
		<div>
			<h1>Menu</h1>
		</div>
	);
}

export default Menu;