import fs from 'fs';
import { getAppSettings } from './config';
const config = getAppSettings();

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

type User = { id: string, characters: string[], customMessages: { [key: string]: string }};
export function getUsers() {
    let users: User[] = [];
    if (fs.existsSync('data/users.json')) {
        users = JSON.parse(fs.readFileSync('data/users.json').toString());
    }

    return users;
}

type VariableLookup = [string, string][];
type CombinedVariableLookup = [string, string, string][];
const globalVariableLookup: CombinedVariableLookup = [
    [ 'serverName', `_${config.valheim.name}_`, config.valheim.name ],
    [ ':joy:', '<:joy:831246652173844494>', 'lmao' ]
];
const textVariableLookup = () => globalVariableLookup.map<[string, string]>(([k, t, v]) => [k, t]);
const voiceVariableLookup = () => globalVariableLookup.map<[string, string]>(([k, t, v]) => [k, v]);

/**
 * 
 * @param template 
 * @param variableLookups 
 */
function fillInTemplate(template: string, variables: VariableLookup) {
    let message = template;
    variables.forEach(([k, v]) => message = message.replace(`{${k}}`, v));
    return message;
}

type CustomMessageOptions = {
    defaultIfNone?: string,
    variables?: VariableLookup
};
/**
 * @param characterName
 * @param messageType
 * @param options
 */
export function getCustomMessages(characterName: string, messageType: string, { defaultIfNone = '', variables = [] }: CustomMessageOptions = {}) {
    const user = getUsers().find(u => u.characters.indexOf(characterName) >= 0);
    if (!user) return {
        text: fillInTemplate(defaultIfNone, [...textVariableLookup(), ...variables, ['name', `_${characterName}_`]]),
        voice: fillInTemplate(defaultIfNone, [...voiceVariableLookup(), ...variables, [ 'name', characterName ]])
    };

    const messageTemplate = user.customMessages[messageType] || defaultIfNone;
    return {
        text: fillInTemplate(messageTemplate, [...textVariableLookup(), ...variables, ['name', `<@${user.id}> (_${characterName}_)`]]),
        voice: fillInTemplate(messageTemplate, [...voiceVariableLookup(), ...variables, [ 'name', characterName ]])
    };
}

/**
 * TODO: Pull users into a class.
 * @param id 
 * @param characterName 
 */
export function addCharacter(id: string, characterName: string) {
    const users = getUsers();
    const existing = users.find(u => u.id === id);
    if (existing) {
        if (!existing.characters.find(c => c === characterName)) {
            existing.characters.push(characterName);
        }
    } else users.push({ id, characters: [ characterName ], customMessages: {} });
    
    fs.writeFileSync('data/users.json', JSON.stringify(users));
}

/**
 * 
 * @param ms 
 */
export function sleep(ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export enum ServerStatuses {
    stopped,
    starting,
    ready
}

export type ServerStatusInfo = {
    status: ServerStatuses,
    name: string,
    ip: string,
    password: string,
    connectedPlayers: { name: string, uptime: string }[],
    uptime: string,
    activeUptime: string
};