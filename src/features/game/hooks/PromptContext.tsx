import React, { ReactNode } from "react";
import usePromptReducer from "./usePromptReducer";
import { Dispatch } from "../../../Types/Types";

interface PromptState {
	isShown: boolean;
	dispatch: Dispatch;
}

export const PromptContext = React.createContext<PromptState>({
	isShown: false,
	dispatch: () => {}
});

export const PromptProvider = ({ children }: { children: ReactNode }) => {
	const [isShown, dispatch] = usePromptReducer();

	const contextValue = {
		isShown,
		dispatch
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		
		if (e.key === 'Escape') {
			dispatch({ type: 'HIDE' });			
		}
	}

	return (
		<PromptContext.Provider value={contextValue}>
			<div onKeyDown={handleKeyDown}>
				{children}
			</div>
		</PromptContext.Provider>
	)
}
