import path from 'path';
import { BotCommand } from '../../../commonTypes';
import { getAppSettings } from '../../../config';
import * as roles from '../roles';

const commandPrefix = getAppSettings().discord.commandPrefix;

export const command: BotCommand = {
    name: 'invalidate',
    description: `In the event that a command ~~or trigger~~ has been updated, this command will cause the bot to pick up the change. Example: \`${commandPrefix}invalidate command help\` would pick up any changes to the \`${commandPrefix}help\` command.`,
    role: roles.Admin,
    active: true,

    execute: (message, rest) => {
        const args = rest.split(' ');
        const config = getAppSettings();

        let objPath = '';
        let prefix = '';
        switch (args[0]) {
            case 'command':
                objPath = __dirname;
                prefix = config.discord.commandPrefix;
                break;
            // case 'trigger':
            //     objPath = '../../triggers';
            //     break;
            default:
                message.channel.send(`I don't know how to invalidate a(n) \`${args[0]}\`.`);
                return Promise.resolve();
        }

        args.slice(1).forEach(module => {
            try {
                delete require.cache[require.resolve(path.join(objPath, module))];
            } catch (e) {
                message.channel.send(`The \`${prefix}${module}\` ${args[0]} does not exist.`);
                return;
            }

            message.channel.send(`The \`${prefix}${module}\` ${args[0]} has been refreshed.`);
        });

        return Promise.resolve();
    }
};