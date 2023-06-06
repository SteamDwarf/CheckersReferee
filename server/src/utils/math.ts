//TODO удалить

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

/** 
 *Функция которая разбивает массив на подмассивы, по указанному количеству элементов в подмассиве
 * @params {T[]} array - Массив элементов
 * @params {number} itemsInSubArray - количество элементов которое должно быть в подмассиве (не более указанного числа)
*/
export const splitArrayByItemsCount = <T>(array: T[], itemsInSubArray: number) => {
    const mainArray: T[][] = [];

    for(let i = 0; i < array.length; i++) {
        if(i % itemsInSubArray === 0) {
            const subArray = [array[i]];
            mainArray.push(subArray);
        }
        else {
            mainArray[mainArray.length - 1].push(array[i]);
        }
    }

    return mainArray;
}

/** 
 *Функция которая разбивает массив на подмассивы, по указанному количеству подмассивов
 * @params {T[]} array - Массив элементов
 * @params {number} subArraysCount - количество подмассивов на которое необходимо разделить переданный массив
*/
export const splitArrayBySubArraysCount = <T>(array: T[], subArraysCount: number) => {
    const itemsInSubArray = Math.ceil(array.length / subArraysCount);
    const mainArray: T[][] = splitArrayByItemsCount(array, itemsInSubArray);

    return mainArray;
}


export const shuffle = <T>(array: T[]) => {
    const shuffledArray = [...array];

    for(let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
}

export const shuffleMutator = <T>(array: T[]) => {

    for(let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }
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

