/**
 * @fileoverview Prompt component that can be used to display a message to the player
 * @module Prompt
 * 
 * @requires React
 * 
 * @exports Prompt
 */

import { usePromptContext} from '../hooks/usePromptContext';
import './Prompt.css';

interface PromptProps { 
	children: React.ReactNode
}

function Prompt({ children }: PromptProps) {

	// it will have bascic styling and show hide logic
	const { isShown } = usePromptContext();

	console.log(isShown);	

	if (!isShown) return null; 

	const wrapperClass = isShown ? 'prompt-wrapper show' : 'prompt-wrapper hide';

	return (
		<div className={wrapperClass}>
			<div className="prompt">
				{children}
			</div>
		</div>
 	)
}

export default Prompt;