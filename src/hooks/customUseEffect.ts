// add a custom use efefct hook using useMemo

import { useRef } from "react";

let renderCount = 0;

export const useEffectCustom = (callback: () => void, deps: any[]) => {
	// const prevDeps = useRef<any[]>([]);

	// const hasChanged = deps.some((dep, i) => {
	// 	return !Object.is(dep, prevDeps.current[i]);
	// });

	// if (hasChanged) {
	// 	callback();
	// }

	// prevDeps.current = deps;

	// console.log('useEffectCustom rendering... "_" duh bro', renderCount++);
}
