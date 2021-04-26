import Discord from 'discord.js';
import fs from 'fs';
import path from 'path';
import { getAppSettings } from '../../../config';
import * as roles from '../roles';

export const name = 'help';
export const description = 'Displays this help bubble.';
export const role = null;
export const active = true;

type Command = { name: string, description: string, role: string, active: boolean, execute: (message: Discord.Message, rest: string) => Promise<void> };
export function execute(message: Discord.Message, rest: string) {
    const commands = fs.readdirSync(__dirname).filter(f => f.endsWith('.js')).map(f => require(path.join(__dirname, f)) as Command);

    const config = getAppSettings();
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