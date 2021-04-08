const Discord = require('discord.js');
const roles = require('./roles');
const config = require('../config');
const fs = require('fs');

// class Command {

//     /**
//      * @type {string}
//      */
//     _command;

//     /**
//      * @type {(rest: string, discordMessage: Discord.Message) => Promise<void>}
//      */
//     _callback;

//     /**
//      * @type {string}
//      */
//     _role;

//     /**
//      * @type {string}
//      */
//     _prefix;

//     /**
//      * 
//      * @param {string} command 
//      * @param {(rest: string, discordMessage: Discord.Message) => Promise<void>} callback
//      * @param {string} role 
//      * @param {string} prefix 
//      */
//     constructor(command, callback, role = null, prefix = '!') {
//         this._command = command;
//         this._callback = callback;
//         this._role = role;
//         this._prefix = prefix;
//     }

//     get command() { return this._command; };
//     get role() { return this._role; };
//     get prefix() { return this._prefix; };

//     // /**
//     //  * 
//     //  * @param {string} rest 
//     //  * @param {Discord.Message} discordMessage
//     //  */
//     // async execute(rest, discordMessage) {
//     //     await this._callback(rest, discordMessage);
//     // }

//     /**
//      * 
//      * @param {string} rest 
//      * @param {Discord.Channel} channel 
//      */
//     async execute(rest, channel) {

//     }
// }

// /**
//  * @type {Command[]}
//  */
// const commands = [];

// /**
//  * 
//  * @param {string} command 
//  * @param {(rest: string, discordMessage: Discord.Message) => Promise<void>} callback 
//  * @param {string} role 
//  * @param {string} prefix 
//  */
// function addCommand(command, callback, role = null, prefix = '!') {
//     commands.push(new Command(command, callback, role, prefix));
// }

/**
 * 
 * @param {Discord.Message} discordMessage 
 * @returns {Promise<boolean>}
 */
// async function tryExecuteCommand(discordMessage) {
//     const firstSpace = discordMessage.content.indexOf(' ');
//     const existing = commands.find(c => {
//         const prefix = discordMessage.content.slice(0, c.prefix.length);
//         const text = firstSpace > 0 ?
//             discordMessage.content.slice(c.prefix.length, firstSpace) :
//             discordMessage.content.slice(c.prefix.length);

//         return c.prefix === prefix && c.command === text && (c.role === null || discordMessage.member.roles.cache.has(c.role));
//     });

//     if (!existing) return false;

//     console.log(`${existing.command} issued by ${discordMessage.author.tag}`);
//     await existing.execute(firstSpace > 0 ? discordMessage.content.slice(firstSpace) : '', discordMessage);

//     return true;
// }

//commands will look like this:
// {
//     role: string,
//     execute: function (rest, channel)
// }


// function tryExecuteCommand(commandName, member, channel) {
//     const command = getCommand(commandName); //require(`./commands/${commandName}`);
// }

// /**
//  * 
//  * @param {string} commandName 
//  * @returns {{ role: string, execute: (rest: string, memeber: Discord.GuildMember, channel: Discord.Channel) => Promise<void> }}
//  */
// function getCommand(commandName) {
//     return require(`./commands/${commandName}`);
// }

/**
 * 
 * @param {{ name: string, rest: string }} commandInfo 
 * @param {Discord.Message} message 
 * @returns {Promise<void>}
 */
async function executeCommand(commandInfo, message) {
    const command = getCommand(commandInfo.name);
    if (!command) return;

    if (command.role !== null && !message.member.roles.cache.has(command.role)) {
        message.reply(`only those with the \`${message.guild.roles.cache.get(command.role).name}\` role can use the \'${config.discord.commandPrefix}${commandInfo}\' command.`);
        return;
    }

    await command.execute(commandInfo.rest, message);
}

/**
 * 
 * @param {string} commandName 
 * @returns {{ role: string, execute: (rest: string, message: Discord.Message) => Promise<void> }}
 */
function getCommand(commandName) {
    return require(`./commands/${commandName}`);
}

/**
 * 
 * @param {string} messageText 
 */
function parseMessage(messageText) {
    if (messageText.indexOf(config.discord.commandPrefix) !== 0) return null;

    const firstSpace = messageText.indexOf(' ');
    const name = messageText.slice(config.discord.commandPrefix.length, firstSpace);

    return {
        name,
        rest: firstSpace > 0 ? messageText.slice(firstSpace).trim() : ''
    };
}

module.exports = { executeCommand, parseMessage };