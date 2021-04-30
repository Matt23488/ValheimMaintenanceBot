import fs from 'fs';
import path from 'path';
import { BotCommand } from '../../../commonTypes';
import { getSettings } from '../../../config';
import * as roles from '../roles';

export const command: BotCommand = {
    name: 'help',
    description: 'Displays this help bubble.',
    admin: false,
    active: true,

    execute: (message, rest) => {
        const commands = fs.readdirSync(__dirname).filter(f => f.endsWith('.js')).map(f => require(path.join(__dirname, f)).command as BotCommand);

        const config = getSettings('appsettings');
        message.channel.send({
            embed: {
                color: 0x0099ff,
                title: 'Command Help',
                description: 'Lists all commands and what they do',
                fields: [{ name: '\u200B', value: '\u200B' }, ...commands.filter(c => c.active && (!c.admin || roles.hasRole(message, roles.Admin))).map(c => {
                    let name = config.discord.commandPrefix + c.name;
                    if (c.admin && message.guild !== null) {
                        name = `${name} - _${message.guild.roles.cache.get(roles.Admin)!.name} role only_`;
                    }
                    return { name, value: c.description };
                })]
            }
        });

        return Promise.resolve();
    }
}