import path from 'path';
import * as roles from '../roles';
import { spawn } from 'child_process';
import { getSettings } from '../../../config';
import * as discordBot from '../bot';
import * as wsClient from '../../wsClient';
import { BotCommand, ServerStatuses } from '../../../commonTypes';
import * as start from './start';

export const command: BotCommand = {
    name: 'reboot',
    description: `Reboots something. Currently supports:\n  * \`bot\` - Reboots me.\n  * \`valheim\` - Reboots ${getSettings('appsettings').valheim.name}.\n  * \`vm\` - Reboots the virtual machine.`,
    role: roles.Admin,
    active: true,

    execute: async (message, rest) => {
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
                    start.command.execute(message, rest);
                    break;
                }

                message.channel.send('Rebooting Valheim Server...');
                await wsClient.sendRequest('shutdown');
                setTimeout(() => start.command.execute(message, rest), 1000);
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
};