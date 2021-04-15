const fs = require('fs');
const path = require('path');

/**
 * Takes a number of milliseconds and formats it into a human-readable string.
 * @param {number} ms Milliseconds.
 * @returns {string} A human-readable string representing the milliseconds.
 */
function formatMilliseconds(ms) {
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
 * @param {number} max The generated number will be up to but not including this value.
 * @param {number} min The generated number will be at least this number.
 */
function getRandomInteger(max, min = 0) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * 
 * @returns {{ id: string, pickOn: boolean, characters: string[] }[]}
 */
function getUsers() {
    /**
     * @type {{ id: string, pickOn: boolean, characters: string[] }[]}
     */
    let users = [];
    if (fs.existsSync(path.join(__dirname, '../users.json'))) {
        users = JSON.parse(fs.readFileSync(path.join(__dirname, '../users.json')));
    }

    return users;
}

/**
 * 
 * @param {string} id 
 * @param {string} characterName 
 */
function addCharacter(id, characterName) {
    const users = getUsers();
    const existing = users.find(u => u.id === id);
    if (existing) {
        if (!existing.characters.find(c => c === characterName)) {
            existing.characters.push(characterName);
        }
    }
    else users.push({ id, pickOn: false, characters: [ characterName ] });
    
    fs.writeFileSync(path.join(__dirname, '../users.json'), JSON.stringify(users));
    console.log('users.json updated');
}

/**
 * 
 * @param {number} ms 
 * @returns {Promise<void>}
 */
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms);
    });
}

module.exports = {
    formatMilliseconds,
    getRandomInteger,
    getUsers,
    addCharacter,
    sleep
};