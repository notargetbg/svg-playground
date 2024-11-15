import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Menu from './Menu'
import React from 'react'
import { GameRef } from '../GameBoard.types'

test('open menu when keyboard escape is pressed', async () => {
	const user = userEvent.setup()
	const gameRef = React.createRef<GameRef>()
	const domRef = React.createRef<SVGSVGElement>()
	render(<Menu gameRef={gameRef} domRef={domRef} />)

	await user.keyboard('{Escape}')

	expect(screen.getByText('Main menu')).toBeInTheDocument()
});

