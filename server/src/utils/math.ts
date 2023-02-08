/* export interface IRange {
    min: () => number,
    max: () => number
}

export const Range = (min: number, max: number): IRange => {
    const _min = min;
    const _max = max;

    return {
        min: () => _min,
        max: () => _max
    }
} */

export const clamp = (value: number, min: number, max: number) => {
    if(value < min) return min;
    if(value > max) return max;

    return value;
}

