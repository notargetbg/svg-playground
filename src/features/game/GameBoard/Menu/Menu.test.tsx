import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Menu from './Menu'
import React from 'react'
import { useGamesDispatch, useGamesState } from '../GameBoard.data'

jest.mock('../GameBoard.data');

describe('Menu', () => {
	const menuTextSelector = 'Main menu';

	beforeEach(() => {
		(useGamesState as jest.Mock).mockReturnValue({
			gameBoards: {},
			activeGame: 'testGame',
			isRunning: true,
			score: 0,
			statusMessage: '',
		});
		(useGamesDispatch as jest.Mock).mockReturnValue(jest.fn());
	});

	describe('when keyboard escape is pressed and the menu is closed', () => {
		test('should open the menu', async () => {
			const user = userEvent.setup();
			const domRef = React.createRef<SVGSVGElement>();
	
			render(<Menu domRef={domRef} />);
			await user.keyboard('{Escape}');
			expect(screen.getByText(menuTextSelector)).toBeInTheDocument()
		})
	});

	describe('when keyboard escape is pressed and the menu is open', () => {
		let user: ReturnType<typeof userEvent.setup>;

		beforeEach(() => {
			user = userEvent.setup();
			const domRef = React.createRef<SVGSVGElement>();
	
			render(<Menu domRef={domRef} />);
		});

		test ('should close the menu', async () => {
			// open menu first
			await user.keyboard('{Escape}');
			// close menu
			await user.keyboard('{Escape}');
			// expect menu to be closed
			expect(screen.queryByText(menuTextSelector)).not.toBeInTheDocument();
		})

		// check that list of items is there
		test ('should show the list of items', async () => {
			// open menu first
			await user.keyboard('{Escape}');
			// expect menu to be closed
			expect(screen.queryByText(menuTextSelector)).toBeInTheDocument();
		})

		describe('when clicking the reset button', () => {
			it('should call the handleRestartGame method', async () => {
				// Open the menu
				await user.keyboard('{Escape}');
				// Find the handleRestartGame function in the rendered component
				const handleRestartGame = screen.getByText('Restart').onclick;
				// Spy on the handleRestartGame function
				const handleRestartGameSpy = jest.fn(handleRestartGame as VoidFunction);
				// Replace the original function with the spy
				screen.getByText('Restart').onclick = handleRestartGameSpy;
				// Click the Restart button
				await user.click(screen.getByText('Restart'));
				// Expect the handleRestartGame function to have been called
				expect(handleRestartGameSpy).toHaveBeenCalled();
			});

			test('should restart the game', async () => {
				// Open the menu
				await user.keyboard('{Escape}');
				// Click the Restart button
				await user.click(screen.getByText('Restart'));
				// Expect the game to have been restarted

				// check if score is reset
				// todo: find a better way to test this
				// check for get ready message
				 
				expect(screen.getByText('GET READY ...')).toBeInTheDocument();
			});


		});
	});

	describe('when selecting a game from top menu', () => {
		it('should start the game', async () => {
			const domRef = React.createRef<SVGSVGElement>();
	
			render(<Menu domRef={domRef} />);			
		})
	})
		
})

