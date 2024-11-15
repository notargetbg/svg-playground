import { renderHook, act } from '@testing-library/react';
import { useGameLoop } from './useGameLoop';
import { useGamesState } from '../GameBoard/GameBoard.data';

jest.mock('../GameBoard/GameBoard.data');

describe('useGameLoop', () => {
	let callback: jest.Mock;
	let isRunning: boolean;

	beforeEach(() => {
		callback = jest.fn();
		isRunning = true;
		(useGamesState as jest.Mock).mockReturnValue({ isRunning });
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.useRealTimers();
	});

	it('should call the callback at the specified interval when running', () => {
		jest.useFakeTimers();
		const delayMs = 1000;

		renderHook(() => useGameLoop(callback, delayMs));

		expect(callback).not.toHaveBeenCalled();

		act(() => {
			jest.advanceTimersByTime(delayMs);
		});

		expect(callback).toHaveBeenCalledTimes(1);

		act(() => {
			jest.advanceTimersByTime(delayMs);
		});

		expect(callback).toHaveBeenCalledTimes(2);
	});

	it('should not call the callback if not running', () => {
		isRunning = false;
		(useGamesState as jest.Mock).mockReturnValue({ isRunning });
		jest.useFakeTimers();
		const delayMs = 1000;

		renderHook(() => useGameLoop(callback, delayMs));

		act(() => {
			jest.advanceTimersByTime(delayMs);
		});

		expect(callback).not.toHaveBeenCalled();
	});

	it('should clear the interval on unmount', () => {
		jest.useFakeTimers();
		const delayMs = 1000;

		const { unmount } = renderHook(() => useGameLoop(callback, delayMs));

		unmount();

		act(() => {
			jest.advanceTimersByTime(delayMs);
		});

		expect(callback).not.toHaveBeenCalled();
	});

	it('should update the interval when delayMs changes', () => {
		jest.useFakeTimers();
		const initialDelayMs = 1000;
		const newDelayMs = 500;

		const { rerender } = renderHook(({ delay }) => useGameLoop(callback, delay), {
			initialProps: { delay: initialDelayMs },
		});

		act(() => {
			jest.advanceTimersByTime(initialDelayMs);
		});

		expect(callback).toHaveBeenCalledTimes(1);

		rerender({ delay: newDelayMs });

		act(() => {
			jest.advanceTimersByTime(newDelayMs);
		});

		expect(callback).toHaveBeenCalledTimes(2);
	});
});