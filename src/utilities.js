
/**
 * Takes a number of milliseconds and formats it into a human-readable string.
 * @param {number} ms Milliseconds.
 * @returns {string} A human-readable string representing the milliseconds.
 */
function formatMilliseconds(ms) {
    ms = Math.floor(ms);
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

    if (seconds > 0) {
        if (str.length > 0) str += ' ';
        str += `${seconds}s`;
    }

    return str;
}

module.exports = {
    formatMilliseconds
};