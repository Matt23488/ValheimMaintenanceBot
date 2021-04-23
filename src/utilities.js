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

// TODO: Maybe combine these two dictionaries into a 3-Tuple array
/**
 * @type {[string, string][]}
 */
const textVariableLookup = [
    [ 'serverName', `_${config.valheim.name}_` ],
    [ ':joy:', '<:joy:831246652173844494>' ]
];
/**
 * @type {[string, string][]}
 */
const voiceVariableLookup = [
    [ 'serverName', config.valheim.name ],
    [ ':joy:', 'lmao' ]
];

/**
 * 
 * @param {string} template 
 * @param {[string, string][][]} variableLookups 
 * @returns {string}
 */
function fillInTemplate(template, ...variableLookups) {
    let message = template;
    variableLookups.forEach(m => m.forEach(([k, v]) => message = message.replace(`{${k}}`, v)));
    return message;
}

/**
 * @param {string} characterName
 * @param {string} messageType
 * @param {{ defaultIfNone: string, variables: [string,string][] }} options
 * @returns {{ text: string, voice: string }}
 */
function getCustomMessages(characterName, messageType, { defaultIfNone = '', variables = [] } = {}) {
    const user = getUsers().find(u => u.characters.indexOf(characterName) >= 0);
    if (!user) return {
        text: fillInTemplate(defaultIfNone.replace('{name}', `_${characterName}_`), textVariableLookup, variables),
        voice: fillInTemplate(defaultIfNone.replace('{name}', characterName), voiceVariableLookup, variables)
    };

    const messageTemplate = user.customMessages[messageType] || defaultIfNone;
    return {
        text: fillInTemplate(messageTemplate.replace('{name}', `<@${user.id}> (_${characterName}_)`), textVariableLookup, variables),
        voice: fillInTemplate(messageTemplate.replace('{name}', characterName), voiceVariableLookup, variables)
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