import path from 'path';
import { BotCommand } from '../../../commonTypes';
import { getSettings } from '../../../config';
import * as roles from '../roles';

const commandPrefix = getSettings('appsettings').discord.commandPrefix;

// TODO: This command might be useless now. Rebooting the bot should refresh all commands anyway. Going to deactivate it for now.
export const command: BotCommand = {
    name: 'invalidate',
    description: `In the event that a command ~~or trigger~~ has been updated, this command will cause the bot to pick up the change. Example: \`${commandPrefix}invalidate command help\` would pick up any changes to the \`${commandPrefix}help\` command.`,
    admin: true,
    active: false,

    execute: (message, rest) => {
        const args = rest.split(' ');
        const config = getSettings('appsettings');

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