/**
 * @fileoverview Prompt component that can be used to display a message to the player
 * @module Prompt
 * 
 * @requires React
 * 
 * @exports Prompt
 */

import usePromptReducer from '../hooks/usePromptReducer';
import './Prompt.css';

interface PromptProps { 
	children: React.ReactNode
}

function Prompt({ children }: PromptProps) {

	// it will have bascic styling and show hide logic
	const [show, dispatch] = usePromptReducer();

	// show/hide prompt
	const togglePrompt = () => {
		dispatch({ type: show ? 'HIDE' : 'SHOW' });
	}

	// if (!show) return null; 

	return (
		<div className="prompt-wrapper">
			<div className="prompt" onKeyDown={togglePrompt}>
			{children}
			</div>
		</div>
 	)
}

export default Prompt;