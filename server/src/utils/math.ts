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


export const shuffle = (array: any[]) => {
    const shuffledArray = [...array];

    for(let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
}

export const getRandomItem = <T>(array: T[], currentIndex?: number) => {
    let index = Math.floor(Math.random() * array.length);

    if(currentIndex) {
        while(index === currentIndex) {
            index = Math.floor(Math.random() * array.length);
        }
    }
    return [array[index], index];
}

