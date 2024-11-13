import { useEffect } from 'react';
import { useRef } from 'react';

type RefCallback = () => void;

export function useInterval(callback: () => void, delay: number) {
    const savedCallback = useRef<RefCallback | null>();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      if (savedCallback.current === null) return;

      console.log('setting interval');      

      function tick() {
        if (savedCallback.current) {
          savedCallback.current();
        } 
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
}

export function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}
