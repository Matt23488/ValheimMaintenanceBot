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
 * 
 * @param max The generated number will be up to but not including this value.
 * @param min The generated number will be at least this number.
 */
export function getRandomInteger(max: number, min = 0) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function nPercentChance(percent: number) {
    return getRandomInteger(100) < percent;
}

/**
 * 
 * @param ms 
 */
export function sleep(ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}