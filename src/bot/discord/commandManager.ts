import Discord from 'discord.js';
import { BotCommand } from '../../commonTypes';
import { getSettings } from '../../config';
import * as roles from './roles';

type CommandInfo = { name: string, rest: string };

/**
 * Executes a bot command.
 * @param commandInfo An object containing the command name and parameters.
 * @param message The Discord.Message object that initiated the command.
 */
export async function executeCommand(commandInfo: CommandInfo, message: Discord.Message) {
    const command = getCommand(commandInfo.name);
    if (!command || !command.active) return;

    const config = getSettings('appsettings');
    if (message.channel.type === 'dm') {
        if (message.author.id !== config.discord.parentalUnit) {
            message.reply(`only my parental unit can command me in dms.`);
            return;
        }
    } else {
        if (command.admin && !message.member!.roles.cache.has(roles.Admin)) {
            message.reply(`only those with the \`${message.guild!.roles.cache.get(roles.Admin)!.name}\` role can use the \'${config.discord.commandPrefix}${commandInfo.name}\' command.`);
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
 * @param commandName The name of the command.
 * @returns The command module, or `null` if the command was not found.
 */
function getCommand(commandName: string): BotCommand | null {
    try {
        return require(`./commands/${commandName}`).command;
    } catch (e) {
        return null;
    }
}

/**
 * Parses message test to separate the command name from the rest of the message, which will be used as parameters for the command.
 * @param messageText The message text.
 * @returns An object containing the command name and parameters.
 */
export function parseMessage(messageText: string): CommandInfo | null {
    const config = getSettings('appsettings');
    if (messageText.indexOf(config.discord.commandPrefix) !== 0) return null;

    const firstSpace = messageText.indexOf(' ');
    const name = firstSpace > 0 ? messageText.slice(config.discord.commandPrefix.length, firstSpace) : messageText.slice(config.discord.commandPrefix.length);

    return {
        name,
        rest: firstSpace > 0 ? messageText.slice(firstSpace).trim() : ''
    };
}