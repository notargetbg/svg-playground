// generic prompt logic that can be used in multiple places
// dispatch action to show/hide prompt
// return show state and toggle function

import { useReducer } from "react";
import { Action } from "redux";

const initialState = false;

function usePromptReducer() {
	return useReducer((state = initialState, action: Action) => {
		switch (action.type) {
			case 'SHOW': {
				return true;
			}				
			case 'HIDE': {
				return false;
			}
			default:
				return state;
		}
	}, false);
}

export default usePromptReducer;



