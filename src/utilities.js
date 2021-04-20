const fs = require('fs');
const path = require('path');
const config = require('./config');

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
 * @param {number} percent 
 * @returns {boolean}
 */
function nPercentChance(percent) {
    return getRandomInteger(100) < percent;
}

/**
 * 
 * @returns {{ id: string, characters: string[], customMessages: {[key: string]: string} }[]}
 */
function getUsers() {
    /**
     * @type {{ id: string, characters: string[], customMessages: {[key: string]: string} }[]}
     */
    let users = [];
    if (fs.existsSync(path.join(__dirname, '../users.json'))) {
        users = JSON.parse(fs.readFileSync(path.join(__dirname, '../users.json')));
    }

    return users;
}

/**
 * @param {string} characterName
 * @param {string} messageType
 * @param {string} defaultIfNone
 * @returns {{ text: string, voice: string }}
 */
function getCustomMessages(characterName, messageType, defaultIfNone = '') {
    const user = getUsers().find(u => u.characters.indexOf(characterName) >= 0);
    if (!user) return {
        text: defaultIfNone.replace('{name}', `_${characterName}_`).replace('{serverName}', `_${config.valheim.name}_`),
        voice: defaultIfNone.replace('{name}', characterName).replace('{serverName}', config.valheim.name)
    };

    const messageTemplate = user.customMessages[messageType] || defaultIfNone;
    return {
        text: messageTemplate.replace('{name}', `<@${user.id}> (_${characterName}_)`).replace('{serverName}', `_${config.valheim.name}_`),
        voice: messageTemplate.replace('{name}', characterName).replace('{serverName}', config.valheim.name)
    };
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
    } else users.push({ id, characters: [ characterName ], customMessages: {} });
    
    fs.writeFileSync(path.join(__dirname, '../users.json'), JSON.stringify(users));
    console.log('users.json updated');
}

/**
 * 
 * @param {number} ms 
 * @returns {Promise<void>}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    formatMilliseconds,
    getRandomInteger,
    nPercentChance,
    getUsers,
    addCharacter,
    getCustomMessages,
    sleep
};