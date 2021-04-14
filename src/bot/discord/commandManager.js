const Discord = require('discord.js');
const config = require('../../config');
const fs = require('fs');

/**
 * Executes a bot command.
 * @param {{ name: string, rest: string }} commandInfo An object containing the command name and parameters.
 * @param {Discord.Message} message The Discord.Message object that initiated the command.
 * @returns {Promise<void>}
 */
async function executeCommand(commandInfo, message) {
    const command = getCommand(commandInfo.name);
    if (!command) return;

    if (message.channel.type === 'dm') {
        if (message.author.id !== config.parentalUnit) {
            message.reply(`only my parental unit can command me in dms.`);
            return;
        }
    } else {
        if (command.role !== null && !message.member.roles.cache.has(command.role)) {
            message.reply(`only those with the \`${message.guild.roles.cache.get(command.role).name}\` role can use the \'${config.discord.commandPrefix}${commandInfo}\' command.`);
            return;
        }
    }

    console.log(`${commandInfo.name} issued by ${message.author.tag}`);
    try {
        // TODO: Maybe add the startTyping()/stopTyping() logic in here
        await command.execute(message, commandInfo.rest);
    } catch (e) {
        console.error(e);
        message.channel.send('There was an error executing the command.');
    }
}

/**
 * Loads a command module with the supplied name.
 * @param {string} commandName The name of the command.
 * @returns {{ name: string, description: string, role: string, execute: (rest: string, message: Discord.Message) => Promise<void> }} The command module, or `null` if the command was not found.
 */
function getCommand(commandName) {
    try {
        return require(`./commands/${commandName}`);
    } catch (e) {
        return null;
    }
}

/**
 * Parses message test to separate the command name from the rest of the message, which will be used as parameters for the command.
 * @param {string} messageText The message text.
 * @returns { name: string, rest: string } An object containing the command name and parameters.
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