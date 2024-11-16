import { useEffect } from "react";
import { useRef } from 'react';
import { useGamesDispatch, useGamesState } from "../GameBoard/GameBoard.data";

type RefCallback = () => void;
let id: NodeJS.Timeout;

export function useGameLoop(callback: VoidFunction, delayMs: number = 1000) {
	const { isRunning, iteration } = useGamesState();
	const dispatch = useGamesDispatch();

	const savedCallback = useRef<RefCallback | null>();
  
    // Remember the latest callback.
    useEffect(() => {
      	savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
		if (savedCallback.current === null) return;

		function tick() {
			if (savedCallback.current && isRunning) {
				dispatch({ type: 'UPDATE_GAME_FIELD', payload: { field: 'iteration', value: iteration + 1 } });
				savedCallback.current();
			} 
		}

		if (delayMs !== null && isRunning) {
			id = setInterval(tick, delayMs);
			return () => clearInterval(id);
		}

    }, [delayMs, isRunning, iteration, dispatch]);
}