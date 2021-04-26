import Discord from 'discord.js';
import path from 'path';
import * as roles from '../roles';
import { spawn } from 'child_process';
import { getAppSettings } from '../../../config';
import * as discordBot from '../bot';
import * as wsClient from '../../wsClient';
import { ServerStatuses } from '../../../commonTypes';

export const name = 'reboot';
export const description = `Reboots something. Currently supports:\n  * \`bot\` - Reboots me.\n  * \`valheim\` - Reboots ${getAppSettings().valheim.name}.\n  * \`vm\` - Reboots the virtual machine.`;
export const role = roles.Admin;
export const active = true;

export async function execute(message: Discord.Message, rest: string) {
    switch (rest) {
        case 'bot':
            await message.channel.send('BRB');
            wsClient.destroy();
            discordBot.getClient().destroy();
            const dir = path.join(__dirname, '../../../..');
            spawn(path.join(dir, 'startbot.bat'), [], { cwd: dir, detached: true });
            process.exit();
            break;
        case 'valheim':
            if (!wsClient.isConnected()) {
                message.channel.send('Valheim server isn\'t started, but I\'ll go ahead and start it for you...');
                require('./start').execute(message, rest);
                break;
            }

            message.channel.send('Rebooting Valheim Server...');
            await wsClient.sendRequest('shutdown');
            setTimeout(() => require('./start').execute(message, rest), 1000);
            break;
        case 'vm':
            if (wsClient.isConnected()) {
                const statusInfo = await wsClient.sendRequest('status');
                if (statusInfo!.status !== ServerStatuses.stopped) {
                    message.channel.send('Stopping server...');
                    await wsClient.sendRequest('shutdown');
                }
                wsClient.destroy();
            }
            await message.channel.send('Rebooting VM. See you folks on the other side.');
            spawn('shutdown', [ '/r' ], { detached: true });
            message.client.destroy();
            process.exit();
            break;
        default:
            message.channel.send(`I don't know how to restart \`${rest}\`.`);
            break;
    }
}