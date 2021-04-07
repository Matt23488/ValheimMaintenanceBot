const Discord = require('discord.js');
const roles = require('./roles');

class Command {

    /**
     * @type {string}
     */
    _command;

    /**
     * @type {(rest: string, discordMessage: Discord.Message) => Promise<void>}
     */
    _callback;

    /**
     * @type {string}
     */
    _role;

    /**
     * @type {string}
     */
    _prefix;

    /**
     * 
     * @param {string} command 
     * @param {(rest: string, discordMessage: Discord.Message) => Promise<void>} callback
     * @param {string} role 
     * @param {string} prefix 
     */
    constructor(command, callback, role = null, prefix = '!') {
        this._command = command;
        this._callback = callback;
        this._role = role;
        this._prefix = prefix;
    }

    get command() { return this._command; };
    get role() { return this._role; };
    get prefix() { return this._prefix; };

    /**
     * 
     * @param {string} rest 
     * @param {Discord.Message} discordMessage
     */
    async execute(rest, discordMessage) {
        await this._callback(rest, discordMessage);
    }
}

/**
 * @type {Command[]}
 */
const commands = [];

/**
 * 
 * @param {string} command 
 * @param {(rest: string, discordMessage: Discord.Message) => Promise<void>} callback 
 * @param {string} role 
 * @param {string} prefix 
 */
function addCommand(command, callback, role = null, prefix = '!') {
    commands.push(new Command(command, callback, role, prefix));
}

/**
 * 
 * @param {Discord.Message} discordMessage 
 * @returns {Promise<boolean>}
 */
async function tryExecuteCommand(discordMessage) {
    const firstSpace = discordMessage.content.indexOf(' ');
    const existing = commands.find(c => {
        const prefix = discordMessage.content.slice(0, c.prefix.length);
    //    const text = discordMessage.content.slice(c.prefix.length, firstSpace > 0 ? firstSpace : null);
        const text = firstSpace > 0 ?
            discordMessage.content.slice(c.prefix.length, firstSpace) :
            discordMessage.content.slice(c.prefix.length);

        return c.prefix === prefix && c.command === text && (c.role === null || discordMessage.member.roles.cache.has(c.role));
    });

    if (!existing) return false;

    await existing.execute(firstSpace > 0 ? discordMessage.content.slice(firstSpace) : '', discordMessage);

    return true;
}

module.exports = { addCommand, tryExecuteCommand };