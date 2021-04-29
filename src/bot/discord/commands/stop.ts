import { getSettings } from '../../../config';
import { BotCommand, ServerStatuses } from '../../../commonTypes';
import * as wsClient from '../../wsClient';
import * as roles from '../roles';
import * as status from './status';
import { sleep } from '../../../utilities';

export const command: BotCommand = {
    name: 'stop',
    description: 'Saves and shuts down the Valheim server if it\'s running.',
    role: roles.Admin,
    active: true,

    execute: async (message, rest) => {
        const config = getSettings('appsettings');
        if (!wsClient.isConnected()) {
            message.channel.send(`The server is not running. Use \`${config.discord.commandPrefix}start\` to start the server.`);
            return;
        }

        const statusInfo = await wsClient.sendRequest('status');
        if (statusInfo!.status === ServerStatuses.stopped) {
            message.channel.send(`The server is not running. Use \`${config.discord.commandPrefix}start\` to start the server.`);
            return;
        }

        await message.channel.send('Stopping server...');
        message.channel.startTyping();
        await wsClient.sendRequest('shutdown');
        await sleep(1000);
        message.channel.stopTyping();
        status.command.execute(message, '');
    }
};