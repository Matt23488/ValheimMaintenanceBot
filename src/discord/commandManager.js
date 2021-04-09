const Discord = require('discord.js');
const config = require('../config');
const fs = require('fs');

/**
 * 
 * @param {{ name: string, rest: string }} commandInfo 
 * @param {Discord.Message} message 
 * @returns {Promise<void>}
 */
async function executeCommand(commandInfo, message) {
    const command = getCommand(commandInfo.name);
    if (!command) return;

    if (message.author.id !== config.parentalUnit && message.channel.type === 'dm') {
        message.reply(`only my parental unit can command me in dms.`);
        return;
    }

    if (command.role !== null && !message.member.roles.cache.has(command.role)) {
        message.reply(`only those with the \`${message.guild.roles.cache.get(command.role).name}\` role can use the \'${config.discord.commandPrefix}${commandInfo}\' command.`);
        return;
    }

    console.log(`${commandInfo.name} issued by ${message.author.tag}`);
    try {
        await command.execute(message, commandInfo.rest);
    } catch (e) {
        console.error(e);
        message.channel.send('There was an error executing the command.');
    }
}

/**
 * 
 * @param {string} commandName 
 * @returns {{ name: string, description: string, role: string, execute: (rest: string, message: Discord.Message) => Promise<void> }}
 */
function getCommand(commandName) {
    try {
        return require(`./commands/${commandName}`);
    } catch (e) {
        return null;
    }
}

/**
 * 
 * @param {string} messageText 
 */
function parseMessage(messageText) {
    if (messageText.indexOf(config.discord.commandPrefix) !== 0) return null;

    const firstSpace = messageText.indexOf(' ');
    const name = firstSpace > 0 ? messageText.slice(config.discord.commandPrefix.length, firstSpace) : messageText.slice(config.discord.commandPrefix.length);

    return {
        name,
        rest: firstSpace > 0 ? messageText.slice(firstSpace).trim() : ''
    };
}

module.exports = { executeCommand, parseMessage };