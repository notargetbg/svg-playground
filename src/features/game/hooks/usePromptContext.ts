import React from "react";
import { PromptContext } from "./PromptContext";

export const usePromptContext = () => {
	const context = React.useContext(PromptContext);
	if (context === undefined) {
		throw new Error('usePromptContext must be used within a PromptProvider');
	}
	return context;
}