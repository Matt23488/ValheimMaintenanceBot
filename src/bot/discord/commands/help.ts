import fs from 'fs';
import path from 'path';
import { BotCommand } from '../../../commonTypes';
import { getSettings } from '../../../config';
import * as roles from '../roles';

export const command: BotCommand = {
    name: 'help',
    description: 'Displays this help bubble.',
    role: null,
    active: true,

    execute: (message, rest) => {
        const commands = fs.readdirSync(__dirname).filter(f => f.endsWith('.js')).map(f => require(path.join(__dirname, f)).command as BotCommand);

        const config = getSettings('appsettings');
        message.channel.send({
            embed: {
                color: 0x0099ff,
                title: 'Command Help',
                description: 'Lists all commands and what they do',
                fields: [{ name: '\u200B', value: '\u200B' }, ...commands.filter(c => c.active && roles.hasRole(message, c.role)).map(c => {
                    let name = config.discord.commandPrefix + c.name;
                    if (c.role !== null && message.guild !== null) {
                        name = `${name} - _${message.guild.roles.cache.get(c.role)!.name} role only_`;
                    }
                    return { name, value: c.description };
                })]
            }
        });

        return Promise.resolve();
    }
}