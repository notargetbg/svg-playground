export const THROTTLE_DELAY = 500;

export const calculateGaps = (blocksCountV: number, blocksCountH: number, size: number) => {
    const width = blocksCountH * size;
    const height = blocksCountV * size;

    return {
        vGap: Math.ceil(width / blocksCountV),
        hGap : Math.ceil(height / blocksCountH),
    }
}

export function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}
