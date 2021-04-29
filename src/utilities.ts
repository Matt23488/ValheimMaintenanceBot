/**
 * Takes a number of milliseconds and formats it into a human-readable string.
 * @param ms Milliseconds.
 * @returns A human-readable string representing the milliseconds.
 */
export function formatMilliseconds(ms: number) {
    let seconds = Math.floor(ms / 1000),
        minutes = 0,
        hours = 0;
    
    if (seconds > 60) {
        minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
    }

    if (minutes > 60) {
        hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
    }

    let str = '';
    if (hours > 0) {
        str += `${hours}h`;
    }

    if (minutes > 0) {
        if (str.length > 0) str += ' ';
        str += `${minutes}m`;
    }

    if (seconds > 0 || str.length === 0) {
        if (str.length > 0) str += ' ';
        str += `${seconds}s`;
    }

    return str;
}

/**
 * Generates a random integer in the range `[min, max)`.
 * @param max The generated number will be up to but not including this value.
 * @param min The generated number will be at least this number.
 */
export function getRandomInteger(max: number, min = 0) {
    return Math.floor(Math.random() * (max - min)) + min;
}

type Percentage = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99 | 100;

/**
 * Will return `true` randomly, with the appropriate probability.
 * @param percent The percentage change that this function will return `true`.
 * @returns `true` if a random integer in the range `[0, 100)` is smaller than the provided value.
 */
export function nPercentChance(percent: Percentage) {
    return getRandomInteger(100) < percent;
}

/**
 * An `async/await` version of `setTimeout`.
 * @param ms The number of milliseconds to wait.
 * @returns A Promise that resolves after the specified number of milliseconds have elapsed.
 */
export function sleep(ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}